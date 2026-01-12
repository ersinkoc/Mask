import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/code/CodeBlock';

const INSTALL_CODE = `npm install @oxog/mask
# or
yarn add @oxog/mask
# or
pnpm add @oxog/mask`;

const BASIC_USAGE_CODE = `import { createMask } from '@oxog/mask';

const mask = createMask();
mask.use(require('@oxog/mask/plugins/core/email').email());
mask.use(require('@oxog/mask/plugins/core/phone').phone());
mask.use(require('@oxog/mask/plugins/core/card').card());

// Email masking
mask.email('john.doe@example.com');
// → j***n.***@e***e.com

// Phone masking
mask.phone('+1-555-123-4567');
// → +1-***-***-4567

// Card masking
mask.card('4532015112830366');
// → **** **** **** 0366`;

export function Docs() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-4">Introduction</h2>
            <p className="text-lg text-muted-foreground mb-6">
              @oxog/mask is a powerful, zero-dependency TypeScript library for masking sensitive data.
              Built with a micro-kernel architecture and plugin system, it provides a flexible and
              extensible way to protect sensitive information while maintaining data utility.
            </p>

            <div className="alert alert-info mb-6">
              <strong>Key Features:</strong>
              <ul className="mt-2">
                <li>Zero runtime dependencies</li>
                <li>100% TypeScript with strict type checking</li>
                <li>Micro-kernel architecture with plugin system</li>
                <li>5 built-in masking strategies</li>
                <li>3 output formats (display, compact, log)</li>
                <li>Deep object traversal with field mapping</li>
                <li>98/98 tests passing with 100% coverage</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Installation</h2>
            <p className="text-muted-foreground mb-4">
              Install @oxog/mask using your favorite package manager:
            </p>
            <CodeBlock code={INSTALL_CODE} language="bash" filename="Install" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Basic Usage</h2>
            <CodeBlock code={BASIC_USAGE_CODE} language="typescript" filename="src/example.ts" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Strategies</h2>
            <p className="text-muted-foreground mb-4">
              Choose from 5 built-in strategies to control how data is masked:
            </p>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>full</CardTitle>
                  <CardDescription>Mask entire value</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>middle (default)</CardTitle>
                  <CardDescription>Mask middle portion</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>first:N</CardTitle>
                  <CardDescription>Keep first N characters</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>last:N</CardTitle>
                  <CardDescription>Keep last N characters</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>partial:N</CardTitle>
                  <CardDescription>Mask partial percentage (0-1)</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
