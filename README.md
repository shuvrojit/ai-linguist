# AI Linguist Project Documentation

## Project Overview

AI Linguist is a modern web application built with TypeScript, Express, and MongoDB that provides intelligent content analysis and processing capabilities. The project consists of both a backend API service and a browser extension.

## Architecture

### Backend (Node.js/Express)

- **Core Technologies**: TypeScript, Express.js, MongoDB, OpenAI API
- **Project Structure**:
  ```
  src/
  ├── api/          # API client implementations
  ├── config/       # Configuration files
  ├── controllers/  # Request handlers
  ├── models/       # MongoDB models
  ├── routes/       # API routes
  ├── services/     # Business logic
  └── utils/        # Utility functions
  ```

### Browser Extension

- **Core Technologies**: React, TypeScript, Vite, TailwindCSS
- **Features**: Content extraction, analysis, and storage

## Setup and Installation

### Prerequisites

- Node.js (v20+ recommended)
- MongoDB (v6+)
- npm or yarn
- Docker (optional)

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URL=mongodb://localhost:27017/ai-linguist
OPENAI_API_KEY=your_openai_api_key
PORT=5000
NODE_ENV=development
```

### Development Setup

1. **Install Dependencies**:

   ```bash
   yarn install
   ```

2. **Start Development Server**:

   ```bash
   yarn dev
   ```

3. **Start Extension Development**:
   ```bash
   yarn dev:extension
   ```

### Docker Setup

Development:

```bash
yarn docker:dev
```

Production:

```bash
yarn docker:prod
```

Testing:

```bash
yarn docker:test
```

## API Documentation

### Page Content Endpoints

#### `POST /api/page-content`

Create new page content

- Body: `{ title, text, url, html, media? }`
- Response: `{ success, data }`

#### `GET /api/page-content`

Get all page contents

- Response: `{ success, data }`

#### `GET /api/page-content/:url`

Get content by URL

- Response: `{ success, data }`

#### `PUT /api/page-content/:url`

Update content

- Body: `{ title?, text?, html?, media? }`
- Response: `{ success, data }`

#### `DELETE /api/page-content/:url`

Delete content

- Response: `{ success, message }`

### Features Endpoints

#### `POST /api/features/summary`

Generate content summary

- Body: `{ url }`
- Response: Summary HTML

#### `POST /api/features/extract`

Extract meaningful text

- Body: `{ content: { text } }`
- Response: Extracted text

#### `POST /api/features/detailed-overview`

Generate detailed content overview

- Body: `{ url }`
- Response: Overview HTML

## Testing

The project includes comprehensive test coverage using Jest:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn coverage
```

## Logging

The application uses Winston for logging with different configurations for development and production:

- **Development**: Console logging with colorization
- **Production**: File-based logging with daily rotation
- **Log Files**:
  - `logs/api-%DATE%.log`: Daily rotating logs
  - `logs/errors.log`: Error-level logs
  - `logs/combined.log`: All logs
  - `logs/exceptions.log`: Uncaught exceptions

## Browser Extension Features

### Content Processing

- Extracts page content automatically
- Supports text analysis and summarization
- Integrates with the backend API for content storage

### UI Components

- Responsive design with TailwindCSS
- Navigation system for saved content
- Content display components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Scripts

### Backend

- `yarn dev`: Start development server
- `yarn build`: Build production version
- `yarn start`: Start production server
- `yarn lint`: Run ESLint
- `yarn format`: Run Prettier

### Extension

- `yarn dev:web`: Start web development
- `yarn dev:extension`: Start extension development
- `yarn build:web`: Build web version
- `yarn build:extension`: Build extension
- `yarn build`: Build both web and extension

## Architecture Decisions

1. **Modular Structure**: The project follows a modular architecture for better maintainability and scalability.
2. **TypeScript**: Used throughout for type safety and better development experience.
3. **MongoDB**: Chosen for its flexibility with unstructured data and scalability.
4. **OpenAI Integration**: Leverages AI capabilities for content analysis.
5. **Docker Support**: Containerization for consistent development and deployment.

## Error Handling

The application implements comprehensive error handling:

- API error responses with appropriate status codes
- Logging of errors with stack traces
- Custom error types for specific scenarios

## Security Considerations

1. CORS configuration for API access
2. Environment variable management
3. Input validation
4. Error message sanitization

## Performance Optimizations

1. Database indexing
2. Caching strategies
3. Response compression
4. Efficient logging with rotation
