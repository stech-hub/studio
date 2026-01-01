import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/page-title';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { CopyableCode } from '@/components/copyable-code';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="API Key Settings" description="Configure your API key to use the AI tools." />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Using Your API Key</CardTitle>
          <CardDescription>
            This application is powered by Google's AI services. To use the tools, you need to provide your own Google AI API key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>For Developers</AlertTitle>
            <AlertDescription>
              This app is designed to be deployed on Vercel from a GitHub repository. The API key is read from server-side environment variables.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 1: Get your Google AI API Key</h3>
            <p className="text-sm text-muted-foreground">
              If you don't have a key, you can create one for free in Google AI Studio.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Create an API Key in Google AI Studio &rarr;
            </a>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 2: Set Environment Variable in Vercel</h3>
            <p className="text-sm text-muted-foreground">
              When you deploy this project to Vercel, you need to add your API key as an environment variable.
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
              <li>Navigate to your project's settings in Vercel.</li>
              <li>Go to the "Environment Variables" section.</li>
              <li>Create a new variable with the name <code className="font-mono bg-muted px-1 py-0.5 rounded">GOOGLE_API_KEY</code>.</li>
              <li>Paste your API key into the value field.</li>
              <li>Save and redeploy your project if necessary.</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Local Development</h3>
            <p className="text-sm text-muted-foreground">
              For local development, create a file named <code className="font-mono bg-muted px-1 py-0.5 rounded">.env</code> in the root of the project and add your key.
            </p>
            <CopyableCode code="GOOGLE_API_KEY=your_api_key_here" />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
