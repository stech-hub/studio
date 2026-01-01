'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestAITools } from '@/ai/flows/suggest-ai-tools';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader, Sparkles } from 'lucide-react';
import { PageTitle } from '@/components/page-title';
import { CopyableCode } from '@/components/copyable-code';

const formSchema = z.object({
  userNeedDescription: z.string().min(10, {
    message: 'Please describe your need in at least 10 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ToolSuggesterPage() {
  const [suggestedTools, setSuggestedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userNeedDescription: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSuggestedTools([]);
    try {
      const result = await suggestAITools(values);
      setSuggestedTools(result.suggestedTools);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get tool suggestions. Please check your API key and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const codeSnippet = `
import { suggestAITools } from '@/ai/flows/suggest-ai-tools';

async function getSuggestions() {
  const suggestions = await suggestAITools({ 
    userNeedDescription: "${form.getValues('userNeedDescription') || 'e.g., I need to create images from text descriptions.'}" 
  });
  console.log(suggestions.suggestedTools);
}
  `.trim();

  return (
    <div className="space-y-8">
      <PageTitle
        title="AI Tool Suggester"
        description="Describe a task or goal, and our AI will suggest the best tools for you."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Find Your Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userNeedDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What do you want to accomplish?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I need to generate marketing copy for a new product' or 'I want to create a logo for my startup'"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Suggest Tools
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Suggestions</CardTitle>
            <CardDescription>AI-powered recommendations will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
            {isLoading && (
              <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
                <Bot className="h-12 w-12" />
                <span>Finding the best tools for you...</span>
              </div>
            )}
            {!isLoading && suggestedTools.length === 0 && (
              <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
                <Bot className="h-12 w-12" />
                <span>Your suggested tools will be shown here.</span>
              </div>
            )}
            {suggestedTools.length > 0 && (
              <ul className="w-full space-y-3">
                {suggestedTools.map((tool, index) => (
                  <li key={index} className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500 ease-out" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{tool}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold font-headline">Developer Snippet</h3>
        <CopyableCode code={codeSnippet} />
      </div>
    </div>
  );
}
