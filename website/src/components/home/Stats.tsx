import { Package, GitBranch, CheckCircle, Type } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const STATS = [
  {
    icon: <Package className="h-5 w-5 text-primary" />,
    label: 'Bundle Size',
    value: '52KB',
    description: 'ESM minified + gzipped',
  },
  {
    icon: <GitBranch className="h-5 w-5 text-primary" />,
    label: 'Dependencies',
    value: '0',
    description: 'Zero runtime dependencies',
  },
  {
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
    label: 'Test Coverage',
    value: '100%',
    description: '98/98 tests passing',
  },
  {
    icon: <Type className="h-5 w-5 text-primary" />,
    label: 'TypeScript',
    value: '100%',
    description: 'Strict mode enabled',
  },
];

export function Stats() {
  return (
    <section className="container mx-auto px-4 py-12 border-t border-border">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription className="text-xs">{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
