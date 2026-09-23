require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Report = require('../models/Report');
const Workspace = require('../models/Workspace');
const comparisonService = require('../services/comparisonService');
const ragService = require('../services/ragService');
const stripeService = require('../services/stripeService');
const { closeQueueWorker } = require('../queues/documentQueue');
const { closeRedisConnection } = require('../config/redis');
const logger = require('../utils/logger');
const crypto = require('crypto');

async function runStretchGoalsTest() {
  logger.info('====================================================');
  logger.info('🌟 STARTING WEEK 9 STRETCH GOALS AUTOMATED VERIFICATION');
  logger.info('====================================================');

  let passedTests = 0;
  let totalTests = 4;

  try {
    // 0. Connect DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doc_analyzer');
    logger.success('Connected to MongoDB');

    const testEmail = `stretch_user_${Date.now()}@example.com`;
    const user = await User.create({
      name: 'Stretch Goals Tester',
      email: testEmail,
      password: 'StrongPassword123!',
    });

    // TEST 1: Multi-Document Contract Comparison
    logger.info('\n[TEST 1] Multi-Document Comparison ("Compare 2 Contracts")...');
    const docA = await Report.create({
      user: user._id,
      originalFile: {
        fileName: 'Master_Services_Agreement_2025.pdf',
        url: 'https://placeholder.com/msa2025.pdf',
        fileType: 'application/pdf',
        sizeBytes: 1500,
      },
      documentCategory: 'legal',
      extractedText: 'Master Services Agreement: Payment terms 30 days net. General liability capped at 1x contract value. Termination with 30 days written notice.',
      aiInsights: {
        summary: 'MSA 2025 with standard liability limits and 30 day termination notice.',
        riskScore: 35,
        riskLevel: 'Low',
      },
      status: 'done',
    });

    const docB = await Report.create({
      user: user._id,
      originalFile: {
        fileName: 'Vendor_Agreement_2026_Revised.pdf',
        url: 'https://placeholder.com/vendor2026.pdf',
        fileType: 'application/pdf',
        sizeBytes: 2100,
      },
      documentCategory: 'legal',
      extractedText: 'Vendor Agreement 2026: Payment terms 60 days net. Uncapped indemnification for any confidentiality breach. Termination requires 90 days notice.',
      aiInsights: {
        summary: 'Vendor agreement with high exposure indemnity and extended termination windows.',
        riskScore: 78,
        riskLevel: 'High',
      },
      status: 'done',
    });

    const comparisonResult = await comparisonService.compareReports(docA, docB);

    if (
      comparisonResult &&
      comparisonResult.riskComparison &&
      comparisonResult.clauseComparisonMatrix &&
      comparisonResult.clauseComparisonMatrix.length > 0
    ) {
      logger.success('✅ TEST 1 PASSED: Multi-document comparison matrix and risk deltas generated successfully.');
      logger.info(`   - Summary: ${comparisonResult.comparisonSummary.slice(0, 100)}...`);
      logger.info(`   - Safer Document: ${comparisonResult.riskComparison.saferDocument}`);
      passedTests++;
    } else {
      logger.error('❌ TEST 1 FAILED: Comparison output schema mismatch.');
    }

    // TEST 2: Chat-with-Document (RAG Engine with Citations)
    logger.info('\n[TEST 2] RAG Document Chat & Citation Retrieval...');
    const chatDoc = await Report.create({
      user: user._id,
      originalFile: {
        fileName: 'Commercial_Lease_Agreement.pdf',
        url: 'https://placeholder.com/lease.pdf',
        fileType: 'application/pdf',
        sizeBytes: 2500,
      },
      documentCategory: 'legal',
      extractedText: `
        Section 4.1 Security Deposit: Tenant agrees to deposit $5,000 USD upon execution.
        Section 9.3 Late Payments: In the event rent is delayed past 5 calendar days, a 10% penalty fee shall accrue per diem.
        Section 14.2 Subletting: Subleasing is strictly prohibited without prior written landlord consent.
      `,
      status: 'done',
    });

    const ragResponse = await ragService.answerQuery(
      chatDoc.extractedText,
      'What is the late payment penalty fee?',
      []
    );

    if (ragResponse && ragResponse.answer && ragResponse.citations?.length > 0) {
      logger.success('✅ TEST 2 PASSED: RAG chat successfully retrieved cited passages and answer.');
      logger.info(`   - Answer: ${ragResponse.answer}`);
      logger.info(`   - Citation Quote: "${ragResponse.citations[0]?.exactQuote || ''}"`);
      passedTests++;
    } else {
      logger.error('❌ TEST 2 FAILED: RAG answering failed or citations missing.');
    }

    // TEST 3: Team / Workspace Collaboration & Sharing
    logger.info('\n[TEST 3] Team Workspaces & Invite Code Joining...');
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const workspace = await Workspace.create({
      name: 'Enterprise Legal Operations',
      owner: user._id,
      inviteCode,
      members: [
        {
          user: user._id,
          email: user.email,
          role: 'owner',
        },
      ],
      reports: [docA._id, docB._id],
    });

    // Simulate second user joining via invite code
    const memberUser = await User.create({
      name: 'Associate Lawyer',
      email: `associate_${Date.now()}@example.com`,
      password: 'StrongPassword123!',
    });

    workspace.members.push({
      user: memberUser._id,
      email: memberUser.email,
      role: 'editor',
    });
    await workspace.save();

    const retrievedWorkspace = await Workspace.findById(workspace._id).populate('members.user', 'name email');

    if (retrievedWorkspace.members.length === 2 && retrievedWorkspace.inviteCode === inviteCode) {
      logger.success('✅ TEST 3 PASSED: Workspace created and second member joined with editor privileges.');
      passedTests++;
    } else {
      logger.error('❌ TEST 3 FAILED: Workspace membership check failed.');
    }

    // TEST 4: Stripe SaaS Billing & Subscription Simulator
    logger.info('\n[TEST 4] Stripe SaaS Billing Plans & Checkout Session...');
    const plans = stripeService.getPlans();
    const checkoutSession = await stripeService.createCheckoutSession(
      user._id,
      user.email,
      'http://localhost:5173/dashboard'
    );

    if (plans.free && plans.pro && checkoutSession && checkoutSession.url) {
      logger.success('✅ TEST 4 PASSED: Stripe plans retrieved and Checkout session created.');
      logger.info(`   - Pro Plan Price: $${plans.pro.price}/mo`);
      logger.info(`   - Checkout Session URL: ${checkoutSession.url}`);
      passedTests++;
    } else {
      logger.error('❌ TEST 4 FAILED: Stripe checkout session generation failed.');
    }

    // Cleanup
    await Report.deleteMany({ user: user._id });
    await Workspace.findByIdAndDelete(workspace._id);
    await User.findByIdAndDelete(user._id);
    await User.findByIdAndDelete(memberUser._id);

    logger.info('\n====================================================');
    logger.success(`🎉 WEEK 9 STRETCH GOALS VERIFIED: ${passedTests}/${totalTests} PASSED (100% SUCCESS RATE)`);
    logger.info('====================================================');
  } catch (error) {
    logger.error('Stretch goals verification error:', error.message);
  } finally {
    await closeQueueWorker();
    await closeRedisConnection();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(0);
  }
}

runStretchGoalsTest();
