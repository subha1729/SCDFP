import express from 'express';
import { generateGeminiChatResponse } from '../services/geminiService.js';

const router = express.Router();

/**
 * AI Copilot Chat Reasoning Endpoint (Gemini / Intelligent Assistant)
 */
router.post('/', async (req, res) => {
  try {
    const { message, context, apiKey } = req.body;
    const response = await generateGeminiChatResponse({
      message: message || '',
      context: context || {},
      apiKey: apiKey || ''
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
