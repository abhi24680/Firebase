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
  imageBuffer: z.string().describe("Base64 encoded image of the classroom."),
});

const AnalyzeCrowdOutputSchema = z.object({
  count: z.number().describe("The number of human heads/people identified in the image."),
  confidence: z.string().describe("Confidence level of the detection."),
  notes: z.string().optional().describe("Observation notes about the crowd density."),
});

export type AnalyzeCrowdInput = z.infer<typeof AnalyzeCrowdInputSchema>;
export type AnalyzeCrowdOutput = z.infer<typeof AnalyzeCrowdOutputSchema>;

export async function analyzeCrowd(input: AnalyzeCrowdInput): Promise<AnalyzeCrowdOutput> {
  return analyzeCrowdFlow(input);
}

const crowdPrompt = ai.definePrompt({
  name: 'analyzeCrowdPrompt',
  input: { schema: AnalyzeCrowdInputSchema },
  output: { schema: AnalyzeCrowdOutputSchema },
  prompt: `You are a high-performance computer vision model specialized in crowd counting (P2PNet simulation).
  
Analyze the provided image of a classroom or hallway. 
1. Count every individual visible in the frame.
2. Return a precise integer count.
3. Note the overall density (Low, Medium, High).

Image data: {{media url=imageBuffer}}`,
});

const analyzeCrowdFlow = ai.defineFlow(
  {
    name: 'analyzeCrowdFlow',
    inputSchema: AnalyzeCrowdInputSchema,
    outputSchema: AnalyzeCrowdOutputSchema,
  },
  async (input) => {
    const { output } = await crowdPrompt(input);
    if (!output) throw new Error("Inference failed to return a count.");
    return output;
  }
);
