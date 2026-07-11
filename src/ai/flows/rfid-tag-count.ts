
'use server';
/**
 * @fileOverview AI RFID Tag Counting Agent using Genkit.
 *
 * - countRfidTags - Analyzes an image to detect and count RFID tags in range.
 * - RfidTagCountInput - Data URI of the room snapshot.
 * - RfidTagCountOutput - Tag count, detected tag IDs, and confidence.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RfidTagCountInputSchema = z.object({
  roomImage: z.string().describe("Base64 encoded image of the classroom as a data URI."),
});

const RfidTagCountOutputSchema = z.object({
  tagCount: z.number().describe("The number of RFID tags detected in the image frame."),
  tagIds: z.array(z.string()).describe("List of detected RFID tag identifiers visible in the image."),
  confidence: z.number().describe("Detection confidence score between 0 and 1."),
  notes: z.string().optional().describe("Observation notes about tag detection."),
});

export type RfidTagCountInput = z.infer<typeof RfidTagCountInputSchema>;
export type RfidTagCountOutput = z.infer<typeof RfidTagCountOutputSchema>;

const rfidTagPrompt = ai.definePrompt({
  name: 'rfidTagCountPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: RfidTagCountInputSchema },
  output: { schema: RfidTagCountOutputSchema },
  prompt: `You are an RFID proximity detection agent specialized in counting active RFID tags within a classroom or facility.

Analyze the provided image to:
1. Identify all visible RFID tags or badge holders carried by individuals.
2. Count the total number of distinct RFID tags detected in range of the reader.
3. If tag IDs are readable from the image, list them; otherwise use placeholder IDs.
4. Provide a confidence score (0.0 to 1.0) based on detection clarity.
5. Note any observations about tag density or unusual patterns.

Image data: {{media url=roomImage}}`,
});

export async function countRfidTags(input: RfidTagCountInput): Promise<RfidTagCountOutput> {
  return rfidTagCountFlow(input);
}

const rfidTagCountFlow = ai.defineFlow(
  {
    name: 'rfidTagCountFlow',
    inputSchema: RfidTagCountInputSchema,
    outputSchema: RfidTagCountOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await rfidTagPrompt(input);
      if (!output) throw new Error("RFID inference failed to return a valid count.");
      return output;
    } catch (error: any) {
      if (error.message?.includes('API key not valid')) {
        throw new Error("AI_AUTH_FAILED: Please provide a valid GOOGLE_GENAI_API_KEY in the .env file.");
      }
      throw error;
    }
  }
);
