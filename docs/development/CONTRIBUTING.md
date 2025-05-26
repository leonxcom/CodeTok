# Contributing to CodeTok

[简体中文](./CONTRIBUTING-zh-CN.md) | English

Thank you for your interest in contributing to CodeTok, an innovative AI project and code application sharing platform! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). We expect all contributors to adhere to this code in all project spaces.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/YOUR-USERNAME/CodeTok.git
   cd CodeTok
   ```
3. Add the upstream repository as a remote
   ```bash
   git remote add upstream https://github.com/CodeTok-ai/CodeTok.git
   ```
4. Keep your fork in sync with the upstream repository
   ```bash
   git pull upstream dev
   ```

## Development Environment

### Prerequisites
- Node.js (version 18.x or higher)
- pnpm (version 8.x or higher)
- Git

### Setting Up the Development Environment

1. Install dependencies
   ```bash
   pnpm install
   ```

2. Create a `.env.local` file with necessary environment variables (see `.env.example` if available)

3. Start the development server
   ```bash
   pnpm dev
   ```

## Coding Standards

We maintain high standards for code quality to ensure that the codebase remains maintainable and consistent.

### TypeScript
- Use TypeScript for all new code
- Ensure strict type checking is enabled
- Avoid using `any` type when possible

### React
- Use functional components with hooks
- Follow React best practices
- Document component props with JSDoc comments

### Styling
- Use Tailwind CSS for styling
- Follow the component design system
- Ensure responsive design principles

### Linting and Formatting
We use ESLint and Prettier to maintain code quality and style consistency:
- Run `pnpm lint` to check for linting issues
- Run `pnpm format` to automatically format code

## Git Workflow

We follow a branch-based development workflow:

1. Create a new branch for each feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. Make your changes in small, focused commits
   ```bash
   git add .
   git commit -m "feat: add new feature" # or "fix:", "docs:", etc.
   ```

3. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding or modifying tests
   - `chore:` for maintenance tasks

4. Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

1. Update your branch with the latest changes from the dev branch before submitting a PR
   ```bash
   git checkout dev
   git pull upstream dev
   git checkout your-branch-name
   git rebase dev
   ```

2. Create a Pull Request against the `dev` branch (not `main`)

3. Ensure your PR includes:
   - A clear, descriptive title using Conventional Commits format
   - A detailed description of the changes
   - References to any related issues
   - Screenshots for UI changes (if applicable)

4. Address any code review feedback

5. Once approved, a maintainer will merge your PR

## Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in the [Issues](https://github.com/CodeTok-ai/CodeTok/issues) section
2. If not, create a new issue using the appropriate template
3. Provide detailed information:
   - For bugs: steps to reproduce, expected behavior, actual behavior, screenshots
   - For features: clear description, use cases, potential implementation ideas

---

Thank you for contributing to CodeTok! Your help makes this project better for everyone.