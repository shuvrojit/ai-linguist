# Contributing to AI Linguist

We love your input! We want to make contributing to AI Linguist as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc documentation for functions and interfaces
- Keep functions small and focused
- Write tests for new functionality

## Git Commit Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update the JSDoc documentation if you change any interfaces
3. Update the .env.example file if you add new environment variables
4. The PR will be merged once you have the sign-off of other developers

## Testing

Before submitting a pull request, make sure all tests pass:

\`\`\`bash

# Run all tests

yarn test

# Run specific test file

yarn test path/to/test

# Update snapshots if needed

yarn test -u
\`\`\`

## Bug Reports

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening)

## Feature Requests

**Great Feature Requests** tend to have:

- A clear and specific use case
- An overview of how you envision it working
- Examples of similar features in other projects (if applicable)
- Any technical details or considerations

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/master/CONTRIBUTING.md).
