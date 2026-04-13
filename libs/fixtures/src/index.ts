// Express mocks — mock request, response, and signed cookie helpers
export { express } from "./express"
export type { MockRequest, MockResponse } from "./express"

// NestJS mocks — partial ExecutionContext for guard/interceptor/filter tests
export { executionContext } from "./nestjs"

// Logger mock — implements LoggerService with jest.fn() methods
export { MockLoggerService } from "./loggers"

// Custom matchers are loaded separately via Jest setupFilesAfterEnv:
//   import '@neoma/fixtures/matchers'
// They are NOT re-exported here — they self-register via expect.extend().
