'use server';

/**
 * @fileOverview Summarizes a long discussion in a group chat.
 *
 * - summarizeDiscussion - A function that summarizes a discussion.
 * - SummarizeDiscussionInput - The input type for the summarizeDiscussion function.
 * - SummarizeDiscussionOutput - The return type for the SummarizeDiscussion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDiscussionInputSchema = z.object({
  discussion: z
    .string()
    .describe('The full text of the discussion to be summarized.'),
});
export type SummarizeDiscussionInput = z.infer<typeof SummarizeDiscussionInputSchema>;

const SummarizeDiscussionOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the discussion.'),
});
export type SummarizeDiscussionOutput = z.infer<typeof SummarizeDiscussionOutputSchema>;

export async function summarizeDiscussion(input: SummarizeDiscussionInput): Promise<SummarizeDiscussionOutput> {
  return summarizeDiscussionFlow(input);
}

const summarizeDiscussionPrompt = ai.definePrompt({
  name: 'summarizeDiscussionPrompt',
  input: {schema: SummarizeDiscussionInputSchema},
  output: {schema: SummarizeDiscussionOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing long discussions in group chats. Please provide a concise and informative summary of the following discussion:\n\n{{{discussion}}}`,
});

const summarizeDiscussionFlow = ai.defineFlow(
  {
    name: 'summarizeDiscussionFlow',
    inputSchema: SummarizeDiscussionInputSchema,
    outputSchema: SummarizeDiscussionOutputSchema,
  },
  async input => {
    const {output} = await summarizeDiscussionPrompt(input);
    return output!;
  }
);
