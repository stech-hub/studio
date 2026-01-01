import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, BookOpen } from 'lucide-react';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
const toolSuggesterImage = PlaceHolderImages.find(p => p.id === 'tool-suggester-card');
const webSummarizerImage = PlaceHolderImages.find(p => p.id === 'web-summarizer-card');

const tools = [
  {
    title: 'AI Tool Suggester',
    description: "Don't know which tool to use? Describe your needs, and our AI will recommend the perfect tool for the job.",
    href: '/tool-suggester',
    icon: <Bot className="w-8 h-8 text-primary" />,
    image: toolSuggesterImage,
  },
  {
    title: 'Webpage Summarizer',
    description: 'Paste any URL and get a concise, easy-to-read summary of the content in seconds. Perfect for research and quick insights.',
    href: '/web-summarizer',
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    image: webSummarizerImage,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white shadow-2xl font-headline">
            AI Powerhouse
          </h1>
          <p className="mt-2 text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
            Unlock the future with our suite of advanced, unique AI-driven tools.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold font-headline text-foreground">Explore Our Tools</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map(tool => (
            <Card key={tool.title} className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-primary/50">
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                <div className="p-3 bg-primary/10 rounded-lg">{tool.icon}</div>
                <div className="flex-1">
                  <CardTitle className="font-headline text-xl">{tool.title}</CardTitle>
                  <CardDescription className="mt-1">{tool.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="mt-4">
                  <Button asChild className="w-full" variant="outline">
                    <Link href={tool.href}>
                      Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
