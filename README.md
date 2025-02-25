# Modern Next.js Starter

A carefully configured starter template featuring Next.js 15, shadcn/ui, and robust code quality tools.

## Features

- ⚡️ **Next.js 15** - The React framework for production
- 🎨 **shadcn/ui** - High-quality, customizable UI components
- 📦 **Monorepo Structure** - Organized with turborepo for scalability
- 🎯 **TypeScript** - Type safety and enhanced developer experience
- 💅 **Tailwind CSS** - Utility-first CSS framework
- ✨ **Prettier** - Code formatting with consistent rules
- 🚨 **ESLint** - Code linting with best practices
- 📱 **Responsive Design** - Mobile-first approach

## Getting Started

1. Clone the repository:





## Key Components

### UI Components
The project uses shadcn/ui components, which are built on top of Radix UI and styled with Tailwind CSS. These components are:
- Fully accessible
- Customizable
- Dark mode ready
- Server-component friendly

### Theme Switching
Built-in dark mode support with a theme toggle button using:
- Next-themes
- Tailwind dark mode
- Local storage persistence

## Code Quality Tools

### ESLint
- Configured with modern React best practices
- TypeScript support
- Import sorting and organization
- Accessibility rules

### Prettier
- Consistent code formatting
- Integrated with ESLint
- Customizable configuration

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm format` - Run Prettier
- `pnpm test` - Run tests (if configured)

## Package Commands

### Root
- `pnpm build` - Build all packages and applications
- `pnpm dev` - Start development environment
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all files

### Web App
- `pnpm web:dev` - Start Next.js development server
- `pnpm web:build` - Build web application
- `pnpm web:start` - Start production server

### UI Package
- `pnpm ui:build` - Build UI components
- `pnpm ui:dev` - Start component development

## Configuration Files

- `.eslintrc.js` - ESLint configuration
- `prettier.config.js` - Prettier configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Turborepo](https://turbo.build/)