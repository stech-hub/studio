'use server';

/**
 * @fileOverview Summarizes the content of a webpage given its URL.
 *
 * - summarizeWebpage - A function that takes a URL and returns a summary of the webpage content.
 * - SummarizeWebpageInput - The input type for the summarizeWebpage function.
 * - SummarizeWebpageOutput - The return type for the summarizeWebpage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractWebsiteContent} from '@/services/website-extractor';

const SummarizeWebpageInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to summarize.'),
});
export type SummarizeWebpageInput = z.infer<typeof SummarizeWebpageInputSchema>;

const SummarizeWebpageOutputSchema = z.object({
  summary: z.string().describe('A summary of the content of the webpage.'),
});
export type SummarizeWebpageOutput = z.infer<typeof SummarizeWebpageOutputSchema>;

export async function summarizeWebpage(input: SummarizeWebpageInput): Promise<SummarizeWebpageOutput> {
  return summarizeWebpageFlow(input);
}

const summarizeWebpagePrompt = ai.definePrompt({
  name: 'summarizeWebpagePrompt',
  input: {schema: z.object({content: z.string()})},
  output: {schema: SummarizeWebpageOutputSchema},
  prompt: `Summarize the content of the following webpage:

{{{content}}}`,
});

const summarizeWebpageFlow = ai.defineFlow(
  {
    name: 'summarizeWebpageFlow',
    inputSchema: SummarizeWebpageInputSchema,
    outputSchema: SummarizeWebpageOutputSchema,
  },
  async input => {
    const content = await extractWebsiteContent(input.url);
    const {output} = await summarizeWebpagePrompt({content});
    return output!;
  }
);
