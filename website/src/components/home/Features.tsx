import { Shield, Zap, Puzzle, Type, Globe, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FEATURES = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: 'Zero Dependencies',
    description: 'No runtime dependencies. Minimal bundle size and maximum performance.',
  },
  {
    icon: <Type className="h-6 w-6 text-primary" />,
    title: '100% TypeScript',
    description: 'Full type safety with strict TypeScript support and comprehensive type definitions.',
  },
  {
    icon: <Puzzle className="h-6 w-6 text-primary" />,
    title: 'Plugin Architecture',
    description: 'Micro-kernel design with extensible plugin system for custom masking logic.',
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: 'Built-in Validation',
    description: 'Comprehensive validation including Luhn algorithm, Mod 97, and RFC-like checks.',
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: 'Universal Support',
    description: 'Works in both Node.js and browser environments with no compatibility issues.',
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: 'Well Tested',
    description: '98/98 tests passing with 100% coverage for core functionality.',
  },
];

export function Features() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Everything you need for data masking
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built with modern best practices and production-ready features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
