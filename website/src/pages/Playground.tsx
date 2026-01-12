import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/code/CodeBlock';

export function Playground() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Playground</h1>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Playground</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The interactive playground is coming soon! For now, you can explore the examples
              and run them locally with the following commands:
            </p>

            <CodeBlock
              code={`# Clone the repository
git clone https://github.com/ersinkoc/mask.git
cd mask

# Install dependencies
npm install

# Run examples
npm run examples

# Try specific examples
npx ts-node examples/basic/01-basic-email-masking.ts`}
              language="bash"
              filename="playground.sh"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
