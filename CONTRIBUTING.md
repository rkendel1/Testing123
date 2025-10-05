# Contributing to Development Studio

Thank you for your interest in contributing! This document provides guidelines for contributing to the Development Studio project.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
- Check the [FAQ](FAQ.md) for common issues
- Search existing issues to avoid duplicates

When creating a bug report, include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Docker version)
- Error messages or logs
- Screenshots if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:
- Clear description of the feature
- Use cases and benefits
- Potential implementation approach
- Any drawbacks or considerations

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Testing123.git
   cd Testing123
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding standards (see below)
   - Test your changes thoroughly
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Explain what was changed and why

## Development Guidelines

### Dockerfile Changes

- Keep the image size minimal
- Use multi-line commands with `&&` for better caching
- Clean up package lists: `rm -rf /var/lib/apt/lists/*`
- Comment complex sections
- Test builds thoroughly

Example:
```dockerfile
RUN apt-get update && apt-get install -y \
    package1 \
    package2 \
    && rm -rf /var/lib/apt/lists/*
```

### Adding Extensions

When adding VS Code extensions:
1. Test the extension works in code-server
2. Add to Dockerfile AND .devcontainer/devcontainer.json
3. Document in README.md
4. Keep the list organized

### Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for technical changes
- Update FAQ.md for common questions
- Keep QUICKSTART.md concise
- Use clear, simple language

### Testing

Before submitting:
1. Build the Docker image: `docker-compose build`
2. Run the container: `docker-compose up -d`
3. Access the IDE: http://localhost:8080
4. Test your specific changes
5. Run the test script: `./test.sh`
6. Check for errors in logs: `docker-compose logs`

### Code Style

**Dockerfile:**
- Use uppercase for commands (RUN, COPY, etc.)
- Indent with spaces (4 spaces)
- Group related operations
- Add comments for clarity

**Shell Scripts:**
- Use bash shebang: `#!/bin/bash`
- Make scripts executable: `chmod +x script.sh`
- Add error handling: `set -e`
- Include descriptive comments

**Documentation:**
- Use Markdown format
- Include code examples
- Add links to relevant resources
- Keep line length reasonable (80-100 chars)

## Project Structure

```
Testing123/
├── .devcontainer/         # GitHub Codespaces config
├── workspace/            # User workspace (examples)
├── Dockerfile           # Main container definition
├── docker-compose.yml   # Orchestration config
├── start.sh            # Startup script
├── test.sh             # Validation script
├── README.md           # Main documentation
├── QUICKSTART.md       # Quick reference
├── ARCHITECTURE.md     # Technical details
├── FAQ.md              # Common questions
├── CONTRIBUTING.md     # This file
└── LICENSE             # MIT License
```

## Types of Contributions Needed

### High Priority
- Bug fixes
- Security improvements
- Performance optimizations
- Documentation improvements

### Medium Priority
- New language support
- Additional development tools
- More VS Code extensions
- Improved startup scripts

### Nice to Have
- Alternative IDE options
- Database integration examples
- CI/CD pipeline examples
- Advanced configurations

## Extension Suggestions

When suggesting new extensions, consider:
- Usefulness to general audience
- Maintenance status
- Size impact on container
- Compatibility with code-server
- No duplicates with existing extensions

## Language Support

When adding new language support:
1. Install the language runtime
2. Add relevant package manager
3. Include linting/formatting tools
4. Add VS Code extension support
5. Create example project
6. Document in README.md

## Release Process

Releases are managed by maintainers:
1. Version bumps follow semantic versioning
2. Changelog is updated for each release
3. Docker images are tagged with versions
4. Release notes summarize changes

## Code Review Process

Pull requests are reviewed for:
- Code quality and style
- Test coverage
- Documentation completeness
- Breaking changes
- Security implications

Reviews typically take 1-3 days.

## Community Guidelines

- Be respectful and constructive
- Help others learn
- Give credit where due
- Focus on the project goals
- Follow GitHub Community Guidelines

## Getting Help

- Ask questions in issues
- Use discussions for broader topics
- Tag maintainers if needed
- Check existing documentation first

## Recognition

Contributors are recognized:
- In pull request comments
- In release notes
- In the project README (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open an issue with the "question" label, and we'll be happy to help!

---

Thank you for contributing to make Development Studio better! 🚀
