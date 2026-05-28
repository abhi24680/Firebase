
'use server';
/**
 * @fileOverview AI Crowd Counting Agent using Genkit.
 * 
 * - analyzeCrowd - Analyzes an image to count the number of people present.
 * - AnalyzeCrowdInput - Data URI of the classroom snapshot.
 * - AnalyzeCrowdOutput - Integer head count and confidence.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeCrowdInputSchema = z.object({
  imageBuffer: z.string().describe("Base64 encoded image of the classroom as a data URI."),
});

const AnalyzeCrowdOutputSchema = z.object({
  count: z.number().describe("The number of human heads/people identified in the image."),
  density: z.enum(["Low", "Medium", "High"]).describe("Overall crowd density."),
  notes: z.string().optional().describe("Observation notes about the crowd."),
});

export type AnalyzeCrowdInput = z.infer<typeof AnalyzeCrowdInputSchema>;
export type AnalyzeCrowdOutput = z.infer<typeof AnalyzeCrowdOutputSchema>;

const crowdPrompt = ai.definePrompt({
  name: 'analyzeCrowdPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: AnalyzeCrowdInputSchema },
  output: { schema: AnalyzeCrowdOutputSchema },
  prompt: `You are a high-performance computer vision model specialized in crowd counting (P2PNet simulation).
  
Analyze the provided image of a classroom or hallway. 
1. Count every individual visible in the frame.
2. Return a precise integer count.
3. Determine the overall density (Low, Medium, High).

Image data: {{media url=imageBuffer}}`,
});

export async function analyzeCrowd(input: AnalyzeCrowdInput): Promise<AnalyzeCrowdOutput> {
  return analyzeCrowdFlow(input);
}

const analyzeCrowdFlow = ai.defineFlow(
  {
    name: 'analyzeCrowdFlow',
    inputSchema: AnalyzeCrowdInputSchema,
    outputSchema: AnalyzeCrowdOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await crowdPrompt(input);
      if (!output) throw new Error("Inference failed to return a valid count.");
      return output;
    } catch (error: any) {
      if (error.message?.includes('API key not valid')) {
        throw new Error("AI_AUTH_FAILED: Please provide a valid GOOGLE_GENAI_API_KEY in the .env file.");
      }
      throw error;
    }
  }
);
