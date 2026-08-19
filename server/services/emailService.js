import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

function getTransporter() {
  if (!transporter) {
    const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    if (user && pass) {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
    }
  }
  return transporter;
}

/**
 * Send an email briefing or purchase order alert to the Manager
 */
export async function sendEmail({ to, subject, text, html }) {
  const mailClient = getTransporter();
  const targetEmail = to || process.env.DEFAULT_MANAGER_EMAIL || 'manager@company.com';

  console.log(`[EmailService] Dispatching email to: ${targetEmail} | Subject: "${subject}"`);

  if (!mailClient) {
    console.log('[EmailService] SMTP credentials not set. Simulated email dispatch successful.');
    return {
      success: true,
      simulated: true,
      messageId: `sim-${Date.now()}`,
      recipient: targetEmail
    };
  }

  try {
    const info = await mailClient.sendMail({
      from: process.env.SMTP_FROM || '"Nexus Supply Chain Intelligence" <no-reply@nexus-supply.io>',
      to: targetEmail,
      subject: subject || 'Supply Chain Telemetry & Executive Forecast Digest',
      text: text || 'Executive update from Nexus Supply Chain Control Center.',
      html: html || `<p>${text || 'Executive update from Nexus Supply Chain Control Center.'}</p>`
    });

    console.log('[EmailService] Live email dispatched successfully. Message ID:', info.messageId);
    return { success: true, simulated: false, messageId: info.messageId, recipient: targetEmail };
  } catch (error) {
    console.error('[EmailService] Live email dispatch failed:', error.message);
    return { success: false, error: error.message, recipient: targetEmail };
  }
}
