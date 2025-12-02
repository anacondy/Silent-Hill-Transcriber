# Contributing to Voice_Link

Thank you for your interest in contributing to Voice_Link! This guide will help you get started.

## Ways to Contribute

### 🐛 Report Bugs
Found a bug? Please open an issue with:
- Device and OS version
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 💡 Suggest Features
Have an idea? Open an issue with:
- Clear description of the feature
- Use case / why it would be useful
- Any implementation ideas

### 📝 Improve Documentation
Help us improve:
- Fix typos or unclear explanations
- Add missing information
- Translate to other languages
- Add examples

### 💻 Submit Code
Want to fix a bug or add a feature?
1. Fork the repository
2. Create a branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push and open a Pull Request

## Development Setup

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm 9+
- Git

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/Silent-Hill-Transcriber.git
cd Silent-Hill-Transcriber

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── main.jsx      # Entry point
├── App.jsx       # Main component
└── index.css     # Styles

public/
├── icon.svg      # App icon
└── manifest.json # PWA manifest
```

## Code Guidelines

### Style
- Use functional components with hooks
- Follow existing code patterns
- Use Tailwind CSS for styling
- Keep components focused and small

### Naming
- Components: PascalCase (`MyComponent`)
- Files: PascalCase for components (`App.jsx`)
- CSS classes: lowercase with hyphens (`my-class`)
- Variables: camelCase (`myVariable`)

### Best Practices
- Avoid unnecessary re-renders (useMemo, useCallback)
- Use semantic HTML
- Ensure accessibility (ARIA labels, keyboard nav)
- Test on multiple devices/browsers

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add language selection dropdown
fix: resolve microphone permission error on iOS
docs: update installation instructions
style: improve button hover animation
refactor: simplify speech recognition logic
```

## Pull Request Process

1. **Update your fork**: `git pull upstream main`
2. **Create a branch**: `git checkout -b fix/issue-123`
3. **Make changes**: Keep them focused
4. **Test**: Verify on desktop and mobile
5. **Commit**: Use clear messages
6. **Push**: `git push origin fix/issue-123`
7. **Open PR**: Describe your changes

### PR Checklist
- [ ] Code follows existing style
- [ ] Tested on Chrome/Safari
- [ ] Tested on mobile
- [ ] No console errors
- [ ] Documentation updated if needed

## Code Review

PRs will be reviewed for:
- Correctness
- Code quality
- Performance impact
- Accessibility
- Mobile compatibility

## Recognition

Contributors will be:
- Listed in release notes
- Thanked in discussions
- Part of project history

## Questions?

- Open a discussion on GitHub
- Tag maintainers in issues

---

Thank you for helping make Voice_Link better! 💚
