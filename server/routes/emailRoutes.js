import express from 'express';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

/**
 * Send Executive Digest / PO Alert to Manager
 */
router.post('/send', async (req, res) => {
  try {
    const { managerEmail, subject, message } = req.body;
    const result = await sendEmail({
      to: managerEmail,
      subject: subject || 'Supply Chain Telemetry & Executive Forecast Digest',
      text: message || 'Executive digest generated from Nexus Supply Chain Control Center.'
    });

    res.json({
      success: true,
      status: 'success',
      message: `Executive digest emailed to ${result.recipient} successfully!`,
      details: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
