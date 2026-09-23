require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Redis = require('ioredis');

async function verifyAllKeys() {
  console.log('==============================================');
  console.log('🔍 VERIFYING CONFIGURED API KEYS & SERVICES');
  console.log('==============================================\n');

  // 1. Test MongoDB
  console.log('[1/5] Testing MongoDB Connection...');
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB: Connected successfully! Host:', mongoose.connection.host);
    await mongoose.disconnect();
  } catch (err) {
    console.log('❌ MongoDB Error:', err.message);
  }

  // 2. Test Cloudinary
  console.log('\n[2/5] Testing Cloudinary Storage...');
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const pingResult = await cloudinary.api.ping();
    console.log('✅ Cloudinary: Connected successfully! Ping result:', pingResult);
  } catch (err) {
    console.log('❌ Cloudinary Error:', err.message);
  }

  // 3. Test Groq
  console.log('\n[3/5] Testing Groq AI API Key...');
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const models = await groq.models.list();
    console.log('✅ Groq AI: Connected successfully! Available models count:', models.data.length);
    // Quick test generation with a supported model
    const testModel = models.data.find(m => m.id.includes('llama-3.3') || m.id.includes('llama-3.1') || m.id.includes('mixtral'))?.id || models.data[0].id;
    console.log('   - Testing completion with model:', testModel);
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello in 3 words' }],
      model: testModel,
    });
    console.log('   - AI Response:', completion.choices[0]?.message?.content);
  } catch (err) {
    console.log('❌ Groq AI Error:', err.message);
  }

  // 4. Test Gemini
  console.log('\n[4/5] Testing Google Gemini API Key...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const res = await model.generateContent('Say hello in 3 words');
    console.log('✅ Gemini AI: Connected successfully! Response:', res.response.text());
  } catch (err) {
    console.log('❌ Gemini AI Notice:', err.message);
  }

  // 5. Test Redis (Upstash)
  console.log('\n[5/5] Testing Upstash Redis & BullMQ Connection...');
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      tls: { rejectUnauthorized: false }, // Upstash requires TLS on port 6379/6380 or rediss protocol
      connectTimeout: 5000,
      lazyConnect: true,
    });
    await redis.connect();
    await redis.set('test_key', 'ok', 'EX', 10);
    const val = await redis.get('test_key');
    console.log('✅ Upstash Redis: Connected successfully! Set/Get verified:', val);
    redis.disconnect();
  } catch (err) {
    console.log('❌ Redis Error:', err.message);
  }

  console.log('\n==============================================');
  console.log('🎉 VERIFICATION COMPLETE');
  console.log('==============================================');
  process.exit(0);
}

verifyAllKeys();
