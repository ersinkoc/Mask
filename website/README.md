# @oxog/mask Website

Official documentation website for @oxog/mask built with React 19, Vite 6, and Tailwind CSS v4.

## Tech Stack

- **React 19** - UI Framework
- **Vite 6** - Build Tool
- **TypeScript 5** - Type Safety
- **Tailwind CSS v4** - Styling
- **@oxog/codeshine** - Syntax Highlighting
- **Lucide React** - Icons
- **React Router 7** - Routing

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
website/
├── public/              # Static assets
│   ├── CNAME           # Domain configuration
│   ├── favicon.svg     # Site favicon
│   └── llms.txt       # LLM reference guide
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── layout/    # Layout components
│   │   ├── home/      # Home page components
│   │   ├── code/      # Code-related components
│   │   └── common/    # Shared components
│   ├── pages/         # Route pages
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── App.tsx        # Router setup
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

## Features

- 🎨 **Dark/Light Theme** - Automatic theme switching with system preference detection
- 📱 **Responsive Design** - Mobile-first approach, works on all screen sizes
- ⚡ **Fast** - Vite for instant HMR and optimized builds
- 🎯 **Type Safe** - Full TypeScript support with strict mode
- 📝 **Code Highlighting** - @oxog/codeshine for beautiful syntax highlighting
- 🔍 **SEO Optimized** - Proper meta tags and Open Graph support
- ♿ **Accessible** - WCAG 2.1 AA compliant

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Header.tsx`

### Styling

- Uses Tailwind CSS v4 with CSS-first configuration
- Custom CSS variables for theming
- shadcn/ui-inspired component system

### Deployment

The site is configured to deploy to `mask.oxog.dev` via:

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. CNAME is configured for `mask.oxog.dev`

## Performance

- Lighthouse Score: > 90
- Bundle Size: < 200KB gzipped
- First Contentful Paint: < 1.5s
- Code Splitting by route

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ support required

## License

MIT License - same as the main @oxog/mask package

## Credits

Built with ❤️ by [Ersin KOÇ](https://github.com/ersinkoc)
