'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { summarizeWebpage } from '@/ai/flows/summarize-webpage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileText, Link as LinkIcon, Loader, Sparkles, Wand2 } from 'lucide-react';
import { PageTitle } from '@/components/page-title';
import { CopyableCode } from '@/components/copyable-code';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function WebSummarizerPage() {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeWebpage(values);
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to summarize the webpage. Please check the URL and your API key.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const codeSnippet = `
import { summarizeWebpage } from '@/ai/flows/summarize-webpage';

async function getSummary() {
  const result = await summarizeWebpage({ 
    url: "${form.getValues('url') || 'https://example.com'}" 
  });
  console.log(result.summary);
}
  `.trim();

  return (
    <div className="space-y-8">
      <PageTitle
        title="Webpage Summarizer"
        description="Instantly get a concise summary of any article or webpage."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Summarize a Webpage</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webpage URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="https://example.com/article" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-headline flex items-center">
                      <Wand2 className="h-4 w-4 mr-2 text-accent" />
                      Advanced Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="space-y-2" aria-disabled="true">
                            <Label>Summary Length</Label>
                             <Select disabled>
                               <SelectTrigger>
                                 <SelectValue placeholder="Default" />
                               </SelectTrigger>
                             </Select>
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Advanced options coming soon!</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-2" aria-disabled="true">
                            <Label>Output Format</Label>
                            <Select disabled>
                              <SelectTrigger>
                                <SelectValue placeholder="Paragraph" />
                              </SelectTrigger>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Advanced options coming soon!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardContent>
                </Card>

                <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Summary</CardTitle>
            <CardDescription>The generated summary will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
            {isLoading && (
              <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
                <FileText className="h-12 w-12" />
                <span>Reading and summarizing...</span>
              </div>
            )}
            {!isLoading && !summary && (
              <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
                <FileText className="h-12 w-12" />
                <span>Enter a URL to generate its summary.</span>
              </div>
            )}
            {summary && (
              <div className="w-full h-full animate-in fade-in-0 duration-500">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
              </div>
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
