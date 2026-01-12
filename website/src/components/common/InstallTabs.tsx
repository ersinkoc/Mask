import { useState } from 'react';
import { NPM_PACKAGE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/code/CodeBlock';

const PACKAGE_MANAGERS = [
  { id: 'npm', label: 'npm', command: `npm install ${NPM_PACKAGE}` },
  { id: 'yarn', label: 'yarn', command: `yarn add ${NPM_PACKAGE}` },
  { id: 'pnpm', label: 'pnpm', command: `pnpm add ${NPM_PACKAGE}` },
  { id: 'bun', label: 'bun', command: `bun add ${NPM_PACKAGE}` },
];

export function InstallTabs() {
  const [active, setActive] = useState('npm');

  const activeManager = PACKAGE_MANAGERS.find((m) => m.id === active) || PACKAGE_MANAGERS[0];

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-2">
        {PACKAGE_MANAGERS.map((manager) => (
          <Button
            key={manager.id}
            variant={active === manager.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActive(manager.id)}
          >
            {manager.label}
          </Button>
        ))}
      </div>
      <CodeBlock code={activeManager.command} language="bash" showLineNumbers={false} />
    </div>
  );
}
