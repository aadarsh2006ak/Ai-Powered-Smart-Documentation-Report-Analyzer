const express = require('express');
const router = express.Router();
const {
  getAllReports,
  getReportById,
  deleteReport,
  getAnalyticsSummary,
  analyzeReport,
  exportReportPdf,
  downloadReportPdf,
  compareReports,
  chatWithDocument,
  seedSampleReports,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Seed 6 specialized domain sample documents
router.post('/seed-samples', protect, seedSampleReports);

// Analytics summary route
router.get('/analytics/summary', protect, getAnalyticsSummary);

// Multi-document contract comparison route
router.post('/compare', protect, compareReports);

// Standard reports CRUD routes
router.route('/').get(protect, getAllReports);

router
  .route('/:id')
  .get(protect, getReportById)
  .delete(protect, deleteReport);

// On-demand AI analysis trigger
router.post('/:id/analyze', protect, analyzeReport);

// Interactive RAG Document Chat route
router.post('/:id/chat', protect, chatWithDocument);

// PDF Export & Download routes
router.post('/:id/export', protect, exportReportPdf);
router.get('/:id/download-pdf', protect, downloadReportPdf);

module.exports = router;
