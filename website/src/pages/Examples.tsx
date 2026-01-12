import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/code/CodeBlock';

const EMAIL_EXAMPLE = `// Basic email masking
mask.email('john.doe@example.com');
// → j***n.***@e***e.com

// Custom strategies
mask.email('john.doe@example.com', { strategy: 'first:2' });
// → jo***@e***e.com

mask.email('john.doe@example.com', { strategy: 'last:3' });
// → j***.***@***.com`;

const OBJECT_EXAMPLE = `// Object masking
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1-555-123-4567',
};

const masked = mask.mask(user, {
  fields: {
    email: { strategy: 'middle' },
    phone: { strategy: 'last:4' },
  },
});

// → {
//   name: 'John Doe',
//   email: 'j***n.***@e***e.com',
//   phone: '+1-555-123-****'
// }`;

const CUSTOM_PLUGIN_EXAMPLE = `// Custom plugin
const customPlugin = {
  name: 'driverLicense',
  version: '1.0.0',
  install(kernel) {
    kernel.registerMasker('driverLicense', (value, options) => {
      const { strategy = 'middle', char = '*' } = options;
      return value.replace(/[a-zA-Z0-9]/g, (match, offset) => {
        // Your masking logic
        return char;
      });
    });
  },
};

mask.use(customPlugin);`;

const EXAMPLES = [
  {
    title: 'Email Masking',
    description: 'Learn the basics of email masking with different strategies.',
    code: EMAIL_EXAMPLE,
    link: '/examples/email',
  },
  {
    title: 'Object Masking',
    description: 'Mask entire objects with selective field protection.',
    code: OBJECT_EXAMPLE,
    link: '/examples/object',
  },
  {
    title: 'Custom Plugins',
    description: 'Create custom plugins for specialized masking needs.',
    code: CUSTOM_PLUGIN_EXAMPLE,
    link: '/examples/plugins',
  },
];

export function Examples() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Examples</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {EXAMPLES.map((example) => (
            <Card key={example.title} className="flex flex-col">
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <CodeBlock
                  code={example.code}
                  language="typescript"
                  showCopyButton={false}
                />
              </CardContent>
              <div className="p-6 pt-0">
                <Link to={example.link}>
                  <Button variant="outline" className="w-full">
                    View Full Example
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Check out all 18 comprehensive examples in the repository
          </p>
          <a
            href="https://github.com/ersinkoc/mask/tree/main/examples"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>View Examples on GitHub</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
