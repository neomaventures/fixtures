import { EXPECTED_COLOR, RECEIVED_COLOR } from "jest-matcher-utils"
import { isEqual } from "lodash"

const matchError = (
  subject: unknown,
  ErrorClass: new (...args: any[]) => Error,
  expectedProps?: Record<string, unknown>,
): jest.CustomMatcherResult => {
  // If it is a function, call it and catch
  if (subject instanceof Function) {
    try {
      subject()
      return {
        pass: false,
        message: () =>
          `Expected function to throw ${EXPECTED_COLOR(ErrorClass.name)}, but it did not throw`,
      }
    } catch (e) {
      subject = e
    }
  }

  // Check type
  if (!(subject instanceof ErrorClass)) {
    return {
      pass: false,
      message: () =>
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- falsy check is intentional for constructor name fallback
        `Expected ${EXPECTED_COLOR(ErrorClass.name)} but got ${RECEIVED_COLOR((subject as any)?.constructor?.name || typeof subject)}`,
    }
  }

  // If no props specified, just type check passes
  if (!expectedProps) {
    return {
      pass: true,
      message: () => `Expected not to be ${EXPECTED_COLOR(ErrorClass.name)}`,
    }
  }

  // Check properties
  for (const [key, value] of Object.entries(expectedProps)) {
    if (!isEqual((subject as any)[key], value)) {
      return {
        pass: false,
        message: () =>
          `Expected ${EXPECTED_COLOR(ErrorClass.name)} with ${EXPECTED_COLOR(`${key}: ${JSON.stringify(value)}`)}, got ${RECEIVED_COLOR(`${key}: ${JSON.stringify((subject as any)[key])}`)}`,
      }
    }
  }

  return {
    pass: true,
    message: () =>
      `Expected not to be ${EXPECTED_COLOR(ErrorClass.name)} with given properties`,
  }
}

expect.extend({
  toThrowMatching: matchError,
  toMatchError: matchError,
})
