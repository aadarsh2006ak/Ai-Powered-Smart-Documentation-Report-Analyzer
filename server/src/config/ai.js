const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const logger = require('../utils/logger');

let geminiClient = null;
let groqClient = null;

if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  logger.info('Gemini AI Client Initialized');
}

if (process.env.GROQ_API_KEY) {
  groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  logger.info('Groq AI Fallback Client Initialized');
}

/**
 * Multi-Provider AI Analyzer with Token Telemetry & Ultra-Fast Groq LPU Engine
 */
const aiService = {
  /**
   * Primary Fast Engine: Groq LPU (qwen3.8-27b ~270ms / gpt-oss-120b ~1000ms)
   */
  analyzeWithGroq: async (prompt, systemInstruction = '', preferredModel = null) => {
    if (!groqClient) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const groqModel = preferredModel || process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
    const startTime = Date.now();

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `${systemInstruction} You must respond ONLY with a valid JSON object matching the requested schema. Do not include markdown formatting or backticks.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: groqModel,
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const latencyMs = Date.now() - startTime;
    const content = completion.choices[0]?.message?.content || '{}';
    const usage = completion.usage || {};
    
    // Clean and parse JSON safely
    let parsedData;
    try {
      const cleanJson = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      // If direct parse fails, try extracting first JSON object
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`Failed to parse AI JSON response: ${e.message}`);
      }
    }

    return {
      data: parsedData,
      telemetry: {
        provider: 'Groq Cloud LPU',
        modelUsed: groqModel,
        promptTokens: usage.prompt_tokens || Math.round(prompt.length / 4),
        completionTokens: usage.completion_tokens || Math.round(content.length / 4),
        totalTokens: usage.total_tokens || Math.round((prompt.length + content.length) / 4),
        inferenceLatencyMs: latencyMs,
      }
    };
  },

  /**
   * Fallback / High-Precision Reasoning: Google Gemini
   */
  analyzeWithGemini: async (prompt, systemInstruction = '') => {
    if (!geminiClient) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const startTime = Date.now();

    const model = geminiClient.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
      systemInstruction: systemInstruction || undefined,
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const latencyMs = Date.now() - startTime;
    const parsedData = JSON.parse(responseText);

    return {
      data: parsedData,
      telemetry: {
        provider: 'Google Gemini',
        modelUsed: modelName,
        promptTokens: Math.round(prompt.length / 4),
        completionTokens: Math.round(responseText.length / 4),
        totalTokens: Math.round((prompt.length + responseText.length) / 4),
        inferenceLatencyMs: latencyMs,
      }
    };
  },

  /**
   * High-Speed Multi-LLM Execution with Telemetry Tracking
   */
  analyzeDocument: async (prompt, systemInstruction = '', preferredModel = null) => {
    // 1. Primary: Ultra-fast Groq LPU (openai/gpt-oss-20b ~500ms)
    if (groqClient) {
      try {
        const modelToUse = preferredModel || process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
        logger.ai(`Executing ultra-fast AI inference via Groq LPU (${modelToUse})...`);
        const result = await aiService.analyzeWithGroq(prompt, systemInstruction, modelToUse);
        logger.success(`Groq inference completed in ${result.telemetry.inferenceLatencyMs}ms [${result.telemetry.totalTokens} tokens]`);
        return result;
      } catch (groqError) {
        logger.warn(`Groq AI primary model error: ${groqError.message}. Attempting fallback to gpt-oss-120b / qwen or Gemini...`);
        
        // Try fallback to gpt-oss-120b on Groq
        if (groqClient) {
          try {
            return await aiService.analyzeWithGroq(prompt, systemInstruction, 'openai/gpt-oss-120b');
          } catch (groqSecondaryErr) {
            logger.warn(`Groq 120b fallback warning: ${groqSecondaryErr.message}`);
          }
        }

        // Fallback to Gemini
        if (geminiClient) {
          try {
            return await aiService.analyzeWithGemini(prompt, systemInstruction);
          } catch (geminiError) {
            logger.error(`Gemini fallback failed: ${geminiError.message}`);
            throw geminiError;
          }
        }
        throw groqError;
      }
    }

    // 2. Secondary: Gemini
    if (geminiClient) {
      logger.ai('Executing AI inference via Gemini...');
      return await aiService.analyzeWithGemini(prompt, systemInstruction);
    }

    throw new Error('No AI provider configured. Please provide GROQ_API_KEY or GEMINI_API_KEY.');
  },
};

module.exports = aiService;
