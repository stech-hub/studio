'use server';

/**
 * @fileOverview An AI tool suggestion flow.
 *
 * - suggestAITools - A function that suggests AI tools based on user needs.
 * - SuggestAIToolsInput - The input type for the suggestAITools function.
 * - SuggestAIToolsOutput - The return type for the suggestAITools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAIToolsInputSchema = z.object({
  userNeedDescription: z
    .string()
    .describe('A description of the user needs for AI tools.'),
});
export type SuggestAIToolsInput = z.infer<typeof SuggestAIToolsInputSchema>;

const SuggestAIToolsOutputSchema = z.object({
  suggestedTools: z
    .array(z.string())
    .describe('An array of suggested AI tools based on the user need.'),
});
export type SuggestAIToolsOutput = z.infer<typeof SuggestAIToolsOutputSchema>;

export async function suggestAITools(input: SuggestAIToolsInput): Promise<SuggestAIToolsOutput> {
  return suggestAIToolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAIToolsPrompt',
  input: {schema: SuggestAIToolsInputSchema},
  output: {schema: SuggestAIToolsOutputSchema},
  prompt: `Based on the following user need description, suggest the most relevant AI tools:

User Need Description: {{{userNeedDescription}}}

Suggest a list of tools that would be helpful for the user.

{{#each suggestedTools}}
- {{{this}}}
{{/each}}`,
});

const suggestAIToolsFlow = ai.defineFlow(
  {
    name: 'suggestAIToolsFlow',
    inputSchema: SuggestAIToolsInputSchema,
    outputSchema: SuggestAIToolsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
