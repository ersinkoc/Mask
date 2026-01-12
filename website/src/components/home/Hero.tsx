import { ArrowRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InstallTabs } from '@/components/common/InstallTabs';
import { CodeBlock } from '@/components/code/CodeBlock';

const QUICK_START_CODE = `import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

// Mask an email
mask.email('john.doe@example.com');
// → j***n.***@e***e.com

// Mask with custom strategy
mask.email('john.doe@example.com', { strategy: 'full' });
// → ***************@*********.***

// Mask a credit card
mask.card('4532015112830366');
// → **** **** **** 0366`;

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-transparent" />
      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            @oxog/mask
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Zero-dependency data masking
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              with plugin architecture
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Powerful, zero-dependency TypeScript library for masking sensitive data.
            Built with a micro-kernel architecture and plugin system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/docs">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://github.com/ersinkoc/mask"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <Github className="h-4 w-4" />
                View on GitHub
              </Button>
            </a>
          </div>

          <div className="w-full max-w-3xl">
            <InstallTabs />
          </div>

          <div className="w-full max-w-3xl mt-12">
            <h3 className="text-sm font-semibold mb-4 text-center text-muted-foreground">
              Quick Start
            </h3>
            <CodeBlock
              code={QUICK_START_CODE}
              language="typescript"
              filename="src/example.ts"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
