require('dotenv').config({ path: __dirname + '/../../.env' });
const app = require('../app');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const http = require('http');

async function runTests() {
  logger.info('Starting Week 2 Backend Auth & File Upload Verification...');

  // Start temporary test server
  const server = http.createServer(app);
  const testPort = 5055;

  await new Promise((resolve) => server.listen(testPort, resolve));
  logger.info(`Test server listening on port ${testPort}`);

  const baseUrl = `http://localhost:${testPort}/api`;

  try {
    // 1. Test Health Endpoint
    logger.info('1. Testing GET /api/health ...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    if (healthData.status === 'online') {
      logger.success('GET /api/health passed:', healthData);
    } else {
      logger.error('GET /api/health unexpected output:', healthData);
    }

    // 2. Test Registration Validation (Negative case)
    logger.info('2. Testing POST /api/auth/register with invalid data...');
    const invalidRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', password: '123' }),
    });
    const invalidRegData = await invalidRegRes.json();
    if (invalidRegRes.status === 400) {
      logger.success('Validation rejection passed as expected:', invalidRegData.message);
    } else {
      logger.warn('Expected 400 validation error, got:', invalidRegRes.status);
    }

    // 3. Test File Upload validation without auth (Negative case)
    logger.info('3. Testing POST /api/upload without Authorization header...');
    const unauthUploadRes = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
    });
    const unauthUploadData = await unauthUploadRes.json();
    if (unauthUploadRes.status === 401) {
      logger.success('Auth guard on /api/upload passed as expected (401 Unauthorized)');
    } else {
      logger.warn('Expected 401 Unauthorized, got:', unauthUploadRes.status);
    }

    logger.success('🎉 Week 2 Verification Smoke Tests Complete!');
  } catch (err) {
    logger.error('Verification encountered an error:', err.message);
  } finally {
    server.close();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

runTests();
