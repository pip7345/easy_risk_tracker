import { Router, Response } from 'express';
import OpenAI from 'openai';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { ApiErrorClass } from '../middleware/errorHandler.js';

const router = Router();

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Query AI with project data
router.post('/query', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { projectData, methodology, apiKey } = req.body;

    if (!projectData || !methodology) {
      throw new ApiErrorClass('Project data and methodology required', 400);
    }

    // Use provided API key or fallback to server key
    const clientApiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!clientApiKey) {
      throw new ApiErrorClass('OpenAI API key required', 400);
    }

    const client = apiKey ? new OpenAI({ apiKey }) : (openai || new OpenAI({ apiKey: clientApiKey }));

    // Construct the prompt
    const prompt = `${methodology}\n\nProject Data:\n${JSON.stringify(projectData, null, 2)}`;

    // Call OpenAI API
    const completion = await client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert crypto project analyst. Analyze the provided project data and return a structured risk assessment.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new ApiErrorClass('No response from AI', 500);
    }

    // Parse the response (assuming it returns JSON)
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch {
      // If not JSON, return as text
      parsedResponse = { analysis: response };
    }

    res.json({
      success: true,
      result: parsedResponse,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
        totalTokens: completion.usage?.total_tokens
      }
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      next(new ApiErrorClass(`OpenAI API Error: ${error.message}`, 500, error));
    } else {
      next(error);
    }
  }
});

export default router;
