import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/code/CodeBlock';

const CREATE_MASK_CODE = `createMask(): MaskKernel
Creates a new mask instance with default configuration.`;

const MASK_EMAIL_CODE = `mask.email(value: string, options?: MaskOptions): string
Masks an email address while preserving the domain structure.

Parameters:
- value: The email address to mask
- options: Optional masking configuration

Options:
- strategy: 'full' | 'middle' | 'first:N' | 'last:N' | 'partial:N'
- char: Character to use for masking (default: '*')
- format: 'display' | 'compact' | 'log' (default: 'display')

Examples:
mask.email('john.doe@example.com');
// → j***n.***@e***e.com

mask.email('john.doe@example.com', { strategy: 'full' });
// → *******************@*********.***

mask.email('john.doe@example.com', { char: '•' });
// → j••n.d•••@e••••••.•••`;

const MASK_PHONE_CODE = `mask.phone(value: string, options?: MaskOptions): string
Masks a phone number with international format support.

Examples:
mask.phone('+1-555-123-4567');
// → +1-***-***-4567

mask.phone('+1-555-123-4567', { strategy: 'first:3' });
// → +1-555-***-****

mask.phone('+1-555-123-4567', { char: 'X' });
// → +1-XXX-XXX-4567`;

const MASK_CARD_CODE = `mask.card(value: string, options?: MaskOptions): string
Masks a credit card with Luhn validation.

Examples:
mask.card('4532015112830366');
// → **** **** **** 0366

mask.card('4532015112830366', { format: 'compact' });
// → ************0366

mask.card('4532015112830366', { strategy: 'full' });
// → ******************

mask.card('4532015112830366', { format: 'log' });
// → [REDACTED:card]`;

export function API() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">API Reference</h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-4">Core API</h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>createMask()</CardTitle>
                <CardDescription>Creates a new mask instance with default configuration.</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={CREATE_MASK_CODE} language="typescript" />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>mask.email()</CardTitle>
                <CardDescription>Masks an email address while preserving the domain structure.</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={MASK_EMAIL_CODE} language="typescript" />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>mask.phone()</CardTitle>
                <CardDescription>Masks a phone number with international format support.</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={MASK_PHONE_CODE} language="typescript" />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>mask.card()</CardTitle>
                <CardDescription>Masks a credit card with Luhn validation.</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={MASK_CARD_CODE} language="typescript" />
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Error Classes</h2>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>InvalidValueError</CardTitle>
                  <CardDescription>Thrown when the input value is invalid or fails validation.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>InvalidStrategyError</CardTitle>
                  <CardDescription>Thrown when an unknown strategy is specified.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>InvalidFormatError</CardTitle>
                  <CardDescription>Thrown when an unknown format is specified.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
