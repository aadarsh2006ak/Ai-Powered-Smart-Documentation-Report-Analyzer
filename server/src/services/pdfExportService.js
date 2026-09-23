const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const logger = require('../utils/logger');

/**
 * Server-Side PDF Report Generator using pdf-lib
 */
const pdfExportService = {
  /**
   * Generate a styled PDF report buffer for an analyzed document
   * @param {Object} report - Mongoose Report document
   * @returns {Promise<Buffer>} Binary PDF buffer
   */
  generateReportPdf: async (report) => {
    try {
      logger.info(`Generating PDF report for Report ID: ${report._id}...`);

      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points
      const { width, height } = page.getSize();

      // Embed Standard Fonts
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      // Color Palette (RGB 0-1)
      const brandBlue = rgb(0.15, 0.45, 0.95);
      const darkNavy = rgb(0.06, 0.09, 0.16);
      const slateGray = rgb(0.35, 0.42, 0.52);
      const lightBg = rgb(0.96, 0.97, 0.99);
      const borderGray = rgb(0.85, 0.88, 0.92);

      const riskColor =
        report.aiInsights?.riskLevel === 'High'
          ? rgb(0.92, 0.25, 0.35)
          : report.aiInsights?.riskLevel === 'Medium'
          ? rgb(0.95, 0.60, 0.10)
          : rgb(0.10, 0.70, 0.45);

      let y = height - 50;

      // 1. Top Decorative Brand Banner
      page.drawRectangle({
        x: 40,
        y: y - 10,
        width: width - 80,
        height: 48,
        color: brandBlue,
      });

      page.drawText('SMARTDOC AI • INTELLIGENCE REPORT', {
        x: 55,
        y: y + 15,
        size: 16,
        font: boldFont,
        color: rgb(1, 1, 1),
      });

      page.drawText('CONFIDENTIAL & PROPRIETARY ANALYSIS', {
        x: 55,
        y: y + 2,
        size: 8,
        font: boldFont,
        color: rgb(0.85, 0.92, 1),
      });

      y -= 70;

      // 2. Metadata Grid
      const metaBoxHeight = 65;
      page.drawRectangle({
        x: 40,
        y: y - metaBoxHeight + 15,
        width: width - 80,
        height: metaBoxHeight,
        color: lightBg,
        borderColor: borderGray,
        borderWidth: 1,
      });

      page.drawText(`Document: ${report.originalFile?.fileName || 'Document'}`, {
        x: 55,
        y: y - 5,
        size: 11,
        font: boldFont,
        color: darkNavy,
      });

      page.drawText(
        `Category: ${(report.documentCategory || 'General').toUpperCase()}  |  Processed: ${new Date(
          report.createdAt || Date.now()
        ).toLocaleDateString()}  |  Duration: ${report.processingTimeMs || 0}ms`,
        {
          x: 55,
          y: y - 25,
          size: 9,
          font: regularFont,
          color: slateGray,
        }
      );

      // Risk score badge in metadata box
      const riskScore = report.aiInsights?.riskScore || 0;
      const riskLevel = report.aiInsights?.riskLevel || 'Low';

      page.drawRectangle({
        x: width - 180,
        y: y - 35,
        width: 125,
        height: 38,
        color: riskColor,
      });

      page.drawText(`RISK SCORE: ${riskScore}/100`, {
        x: width - 170,
        y: y - 15,
        size: 9,
        font: boldFont,
        color: rgb(1, 1, 1),
      });

      page.drawText(`Level: ${riskLevel} Severity`, {
        x: width - 170,
        y: y - 28,
        size: 8,
        font: boldFont,
        color: rgb(1, 1, 1),
      });

      y -= 90;

      // Helper for Section Titles
      const drawSectionHeader = (title) => {
        page.drawText(title.toUpperCase(), {
          x: 40,
          y,
          size: 11,
          font: boldFont,
          color: brandBlue,
        });
        page.drawLine({
          start: { x: 40, y: y - 4 },
          end: { x: width - 40, y: y - 4 },
          thickness: 1.5,
          color: borderGray,
        });
        y -= 20;
      };

      // Helper for wrapping text into lines
      const wrapText = (text, maxWidth, fontSize, font) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = font.widthOfTextAtSize(testLine, fontSize);
          if (testWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
      };

      // 3. Executive Summary
      drawSectionHeader('1. Executive Summary');
      const summaryText =
        report.aiInsights?.summary || 'No executive summary available for this document.';
      const summaryLines = wrapText(summaryText, width - 90, 9.5, regularFont);

      for (const line of summaryLines) {
        if (y < 60) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = height - 50;
        }
        page.drawText(line, {
          x: 45,
          y,
          size: 9.5,
          font: regularFont,
          color: darkNavy,
        });
        y -= 14;
      }
      y -= 15;

      // 4. Action Items Checklist
      drawSectionHeader('2. Recommended Action Items & Obligations');
      const actionItems = report.aiInsights?.actionItems || [];
      if (actionItems.length === 0) {
        page.drawText('• No immediate action items identified.', {
          x: 45,
          y,
          size: 9,
          font: italicFont,
          color: slateGray,
        });
        y -= 15;
      } else {
        for (const item of actionItems.slice(0, 8)) {
          if (y < 60) {
            page = pdfDoc.addPage([595.28, 841.89]);
            y = height - 50;
          }
          const itemLines = wrapText(item, width - 110, 9, regularFont);
          page.drawText('[  ]', {
            x: 45,
            y,
            size: 9,
            font: boldFont,
            color: brandBlue,
          });
          for (let i = 0; i < itemLines.length; i++) {
            page.drawText(itemLines[i], {
              x: 65,
              y: y - i * 13,
              size: 9,
              font: regularFont,
              color: darkNavy,
            });
          }
          y -= itemLines.length * 13 + 6;
        }
      }
      y -= 15;

      // 5. Key Entities & Extracted Clauses Table
      drawSectionHeader('3. Extracted Key Entities & Contract Clauses');
      const entities = report.aiInsights?.keyEntities || [];
      if (entities.length === 0) {
        page.drawText('• No entities cataloged.', {
          x: 45,
          y,
          size: 9,
          font: italicFont,
          color: slateGray,
        });
        y -= 15;
      } else {
        for (const entity of entities.slice(0, 8)) {
          if (y < 60) {
            page = pdfDoc.addPage([595.28, 841.89]);
            y = height - 50;
          }
          page.drawRectangle({
            x: 45,
            y: y - 16,
            width: width - 90,
            height: 20,
            color: lightBg,
            borderColor: borderGray,
            borderWidth: 0.5,
          });

          page.drawText(entity.label, {
            x: 55,
            y: y - 10,
            size: 8.5,
            font: boldFont,
            color: brandBlue,
          });

          const valText = entity.value.length > 55 ? entity.value.slice(0, 52) + '...' : entity.value;
          page.drawText(valText, {
            x: 220,
            y: y - 10,
            size: 8.5,
            font: regularFont,
            color: darkNavy,
          });
          y -= 24;
        }
      }

      // 6. Footer on all pages
      const totalPages = pdfDoc.getPageCount();
      for (let i = 0; i < totalPages; i++) {
        const p = pdfDoc.getPage(i);
        p.drawText(`SmartDoc AI Report — Generated on ${new Date().toISOString()}`, {
          x: 40,
          y: 30,
          size: 7.5,
          font: regularFont,
          color: slateGray,
        });
        p.drawText(`Page ${i + 1} of ${totalPages}`, {
          x: width - 95,
          y: 30,
          size: 7.5,
          font: boldFont,
          color: slateGray,
        });
      }

      const pdfBytes = await pdfDoc.save();
      logger.success(`PDF report generated successfully (${(pdfBytes.length / 1024).toFixed(1)} KB)`);
      return Buffer.from(pdfBytes);
    } catch (error) {
      logger.error('PDF generation failed:', error.message);
      throw error;
    }
  },
};

module.exports = pdfExportService;
