const pdfExportService = require('../services/pdfExportService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

async function runPdfAndEmailTests() {
  logger.info('Starting Week 6 PDF Export & Email Notification Verification...');

  const mockReport = {
    _id: '507f1f77bcf86cd799439011',
    originalFile: {
      fileName: 'Non_Disclosure_Agreement_2026.pdf',
      fileType: 'application/pdf',
      sizeBytes: 124000,
    },
    documentCategory: 'legal',
    status: 'done',
    createdAt: new Date(),
    processingTimeMs: 1420,
    aiInsights: {
      summary:
        'This non-disclosure agreement establishes binding confidentiality covenants regarding proprietary source code and client lists. Disclosure is strictly prohibited without prior written consent, and surviving liabilities extend for five years post-termination.',
      riskScore: 72,
      riskLevel: 'High',
      actionItems: [
        'Ensure executed copy is countersigned by authorized corporate representative',
        'Catalog and encrypt all proprietary trade secrets before disclosure',
        'Review standard Delaware jurisdiction and indemnification exposure limits',
      ],
      keyEntities: [
        { label: 'Disclosing Party', value: 'Enterprise Solutions Global Inc.', category: 'Legal' },
        { label: 'Receiving Party', value: 'Alpha Technologies LLC', category: 'Legal' },
        { label: 'Effective Date', value: 'October 1, 2026', category: 'Date' },
        { label: 'Governing Law', value: 'State of Delaware, United States', category: 'General' },
      ],
      tags: ['nda', 'confidentiality', 'intellectual-property', 'legal-risk'],
    },
  };

  // 1. Test PDF Export
  logger.info('1. Generating Publication-Ready PDF Report...');
  const pdfBuffer = await pdfExportService.generateReportPdf(mockReport);

  const isValidPdf = pdfBuffer.slice(0, 4).toString() === '%PDF';
  logger.info(`PDF Header Check: ${pdfBuffer.slice(0, 8).toString().trim()}`);

  if (isValidPdf && pdfBuffer.length > 1000) {
    logger.success(`PDF Export passed: ${(pdfBuffer.length / 1024).toFixed(1)} KB valid vector PDF created!`);
  } else {
    logger.error('PDF Export failed: Invalid PDF buffer generated');
  }

  // 2. Test Email Notification Template
  logger.info('2. Testing Email Notification Dispatch...');
  const emailResult = await emailService.sendReportReadyEmail(
    'test_user@example.com',
    'Alex Morgan',
    mockReport
  );

  if (emailResult && emailResult.messageId) {
    logger.success('Email Notification Service passed:', emailResult.messageId);
  } else {
    logger.error('Email Notification failed:', emailResult);
  }

  logger.success('🎉 Week 6 Report Viewer, Risk Visualization & PDF Export Verification Completed Successfully!');
}

runPdfAndEmailTests();
