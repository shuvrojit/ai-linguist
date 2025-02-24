# AI Linguist Project Documentation

## Project Overview

AI Linguist is an advanced natural language processing platform built with TypeScript, Express, and MongoDB. It leverages state-of-the-art AI models to provide intelligent content analysis, language processing, and text transformation capabilities through a RESTful API service.

## Architecture

### Backend (Node.js/Express)

- **Core Technologies**: TypeScript, Express.js, MongoDB, OpenAI API
- **Project Structure**:
  ```
  src/
  ├── config/       # Configuration files
  ├── controllers/  # Request handlers
  ├── models/       # MongoDB models
  ├── routes/       # API routes
  ├── services/     # Business logic
  └── utils/        # Utility functions
  ```

## Setup and Installation

### Prerequisites

- Node.js (v20+ recommended)
- MongoDB (v8+)
- yarn or npm
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

All API endpoints are prefixed with `/api/v1`.

### Features Routes

- `POST /features/analyze` - Analyze content meaning
- `POST /features/analyze-by-id` - Analyze content by ID

### Page Content Routes

- `POST /page-content` - Create new page content
- `GET /page-content` - Get all page content
- `GET /page-content/id/:id` - Get page content by ID
- `GET /page-content/:url` - Get page content by URL
- `PUT /page-content/:url` - Update page content
- `DELETE /page-content/:url` - Delete page content

### Job Description Routes

- `POST /jobs` - Create new job description
- `GET /jobs` - Get all job descriptions
- `GET /jobs/active` - Get active job listings
- `GET /jobs/:id` - Get job description by ID
- `PATCH /jobs/:id` - Update job description
- `DELETE /jobs/:id` - Delete job description

### Scholarship Routes

- `POST /scholarships` - Create new scholarship
- `GET /scholarships` - Get all scholarships
- `GET /scholarships/active` - Get active scholarships
- `GET /scholarships/country/:country` - Get scholarships by country
- `GET /scholarships/:id` - Get scholarship by ID
- `PATCH /scholarships/:id` - Update scholarship
- `DELETE /scholarships/:id` - Delete scholarship

### Blog Routes

- `POST /blogs` - Create new blog post
- `GET /blogs` - Get all blog posts
- `GET /blogs/:id` - Get blog post by ID
- `PATCH /blogs/:id` - Update blog post
- `DELETE /blogs/:id` - Delete blog post

### News Routes

- `POST /news` - Create news article
- `GET /news` - Get all news articles
- `GET /news/breaking` - Get breaking news
- `GET /news/category/:category` - Get news by category
- `GET /news/:id` - Get news article by ID
- `PATCH /news/:id` - Update news article
- `DELETE /news/:id` - Delete news article

### Technical Content Routes

- `POST /technical` - Create technical content
- `GET /technical` - Get all technical content
- `GET /technical/technology/:technology` - Get content by technology
- `GET /technical/complexity/:level` - Get content by complexity level
- `GET /technical/:id` - Get technical content by ID
- `PATCH /technical/:id` - Update technical content
- `DELETE /technical/:id` - Delete technical content

### Other Content Routes

- `POST /other` - Create other content
- `GET /other` - Get all other content
- `GET /other/type/:type` - Get content by type
- `GET /other/complexity/:level` - Get content by complexity level
- `GET /other/:id` - Get content by ID
- `PATCH /other/:id` - Update content
- `DELETE /other/:id` - Delete content

## AI Processing Pipeline

The application implements a sophisticated AI processing pipeline:

1. Text Preprocessing

   - Tokenization
   - Normalization
   - Entity Recognition

2. AI Model Integration

   - OpenAI GPT models
   - Custom fine-tuned models
   - Specialized language models

3. Post-processing
   - Format standardization
   - Quality checks
   - Confidence scoring

## Testing

The project includes comprehensive test coverage using Jest:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn coverage

# Generate coverage report for Coveralls
yarn coverage:coveralls
```

## Code Quality Tools

The project maintains high code quality standards through:

### Linting and Formatting

- ESLint with TypeScript support
- Prettier for consistent code formatting
- Pre-commit hooks using Husky and lint-staged

### Available Scripts

- `yarn lint`: Run ESLint
- `yarn lint:fix`: Fix ESLint issues
- `yarn format`: Check formatting with Prettier
- `yarn format:fix`: Fix formatting issues

## Logging

The application uses Winston for logging with different configurations for development and production:

- **Development**: Console logging with colorization
- **Production**: File-based logging with daily rotation
- **Log Files**:
  - `logs/api-%DATE%.log`: Daily rotating logs
  - `logs/errors.log`: Error-level logs
  - `logs/combined.log`: All logs
  - `logs/exceptions.log`: Uncaught exceptions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Scripts

### Development

- `yarn dev`: Start development server with nodemon
- `yarn build`: Build TypeScript to JavaScript
- `yarn start`: Start production server with PM2
- `yarn start:prod`: Start production server without daemon mode

### Docker

- `yarn docker:dev`: Start development environment
- `yarn docker:prod`: Build and start production environment
- `yarn docker:test`: Run tests in Docker environment

### Testing and Quality

- `yarn test`: Run Jest tests
- `yarn test:watch`: Run tests in watch mode
- `yarn coverage`: Generate test coverage
- `yarn coverage:coveralls`: Generate coverage for Coveralls
- `yarn lint`: Run ESLint
- `yarn lint:fix`: Fix ESLint issues
- `yarn format`: Check Prettier formatting
- `yarn format:fix`: Fix Prettier formatting issues

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
