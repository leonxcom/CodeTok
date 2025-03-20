# NoStudy.AI - Next Generation Project-Based AI Native Education Platform

Practice, Not Study - Next Generation Project-Based AI Native Education Platform

Through practice to enhance real capabilities, let knowledge create actual value

## 🏗 Technical Architecture

### Core Philosophy

- **Practice First**: Abandon traditional passive learning modes for a "learn by doing" approach
- **Project Driven**: Gain practical experience through real projects, not just knowledge accumulation
- **AI Native**: Deeply integrate AI technology into the learning process
- **Instant Application**: Emphasize practical skills that can be immediately applied
- **Build in Public**: Share our product building process and startup journey openly

### Core Technology Stack

#### Frontend
- **Framework**: Next.js 13+ (App Router)
- **UI Library**: React 18+
- **Language**: TypeScript 5.0+
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Internationalization**: next-intl
- **Component Library**: shadcn/ui

#### AI Integration
- **LLM Engine**: GPT-4
- **Features**:
  - Real-time code review
  - Intelligent learning path generation
  - Personalized progress tracking
  - Smart Q&A support
  - Code optimization suggestions

#### Development Tools
- **Package Manager**: pnpm
- **Code Quality**:
  - ESLint
  - Prettier
  - TypeScript strict mode
- **Git Workflow**:
  - Conventional Commits
  - Branch-based development
  - GitHub Actions CI/CD

### System Architecture

```
NoStudy.AI/
├── app/                      # Next.js 13 App Router
│   ├── [locale]/            # i18n routes
│   ├── api/                 # API routes
│   └── providers.tsx        # Global providers
├── components/              # React components
│   ├── ui/                 # Base UI components
│   └── features/           # Feature components
├── config/                  # Configuration files
├── i18n/                    # Internationalization
│   ├── client.ts           # Client-side i18n
│   └── server.ts           # Server-side i18n
├── lib/                     # Utility functions
├── messages/               # Translation files
├── public/                 # Static assets
└── styles/                 # Global styles
```

### Key Features Implementation

#### 1. AI-Native Learning System
- Real-time code analysis and feedback
- Intelligent progress tracking
- Personalized learning path generation
- Smart content recommendation

#### 2. Project-Based Learning
- Real-world project templates
- Step-by-step guidance
- Code review automation
- Progress tracking and analytics

#### 3. Multi-language Support
- Dynamic route-based i18n
- Language detection and switching
- RTL support
- Locale-specific content

#### 4. Performance Optimization
- Server-side rendering
- Static page generation
- Image optimization
- Code splitting
- Edge caching

#### 5. Security Measures
- Authentication and authorization
- Rate limiting
- CORS configuration
- Input validation
- XSS protection

### Development Standards

1. **Code Quality**
   - Strict TypeScript configuration
   - Comprehensive ESLint rules
   - Consistent code formatting
   - Unit test coverage

2. **Git Workflow**
   - Feature branch workflow
   - Conventional commit messages
   - Pull request reviews
   - Automated testing

3. **Documentation**
   - Inline code documentation
   - API documentation
   - Component storybook
   - Development guides

4. **Performance Metrics**
   - Core Web Vitals monitoring
   - Lighthouse scores
   - Error tracking
   - User analytics

### Deployment Architecture

- **Production Environment**
  - Vercel (Primary hosting)
  - Edge functions
  - CDN distribution
  - Automated deployments

- **Development Environment**
  - Local development setup
  - Development servers
  - Hot module replacement
  - Debug tooling

---

For more technical details, please refer to our documentation.

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`. Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
