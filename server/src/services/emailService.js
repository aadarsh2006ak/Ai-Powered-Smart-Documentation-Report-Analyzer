const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  // If SMTP credentials exist in environment
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    logger.info('SMTP Email Transporter Initialized');
  } else {
    // Development fallback mock transport
    logger.info('Using simulated Email Transporter (Credentials not provided)');
    transporter = {
      sendMail: async (mailOptions) => {
        logger.info(`[Simulated Email] To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
        return { messageId: `mock_${Date.now()}` };
      },
    };
  }

  return transporter;
};

/**
 * Email Notification Service
 */
const emailService = {
  /**
   * Send completion notification email to user
   */
  sendReportReadyEmail: async (userEmail, userName, report) => {
    try {
      const client = await getTransporter();

      const riskBadgeColor =
        report.aiInsights?.riskLevel === 'High'
          ? '#e11d48'
          : report.aiInsights?.riskLevel === 'Medium'
          ? '#d97706'
          : '#059669';

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"SmartDoc AI" <no-reply@smartdoc.ai>',
        to: userEmail,
        subject: `[SmartDoc AI] Analysis Ready: ${report.originalFile?.fileName || 'Your Document'}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #090d16; color: #f3f4f6; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 800;">SmartDoc AI</h1>
              <p style="color: #e0e7ff; margin: 4px 0 0; font-size: 13px;">Document Intelligence Report</p>
            </div>
            
            <div style="padding: 24px 28px;">
              <p style="font-size: 15px; margin-top: 0;">Hi <strong>${userName || 'there'}</strong>,</p>
              <p style="font-size: 14px; color: #94a3b8; line-height: 1.5;">Your document <strong>"${report.originalFile?.fileName}"</strong> has been analyzed by our AI pipeline.</p>
              
              <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 18px; margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Risk Evaluation</span>
                  <span style="background: ${riskBadgeColor}20; color: ${riskBadgeColor}; border: 1px solid ${riskBadgeColor}50; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700;">
                    ${report.aiInsights?.riskScore || 0}/100 (${report.aiInsights?.riskLevel || 'Low'} Risk)
                  </span>
                </div>
                <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">${report.aiInsights?.summary || 'Analysis summary is ready in your dashboard.'}</p>
              </div>

              <div style="text-align: center; margin-top: 28px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/reports/${report._id}" style="background: linear-gradient(135deg, #2563eb, #6366f1); color: white; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">View Full Analysis & Export PDF</a>
              </div>
            </div>

            <div style="background: #0d1322; padding: 16px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b;">
              © 2026 SmartDoc AI Inc. All rights reserved.
            </div>
          </div>
        `,
      };

      const info = await client.sendMail(mailOptions);
      logger.success(`Notification email sent to ${userEmail} [Message ID: ${info.messageId}]`);
      return info;
    } catch (error) {
      logger.warn(`Failed to send notification email: ${error.message}`);
      return null;
    }
  },
};

module.exports = emailService;
