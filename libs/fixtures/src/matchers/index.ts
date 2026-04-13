import { EXPECTED_COLOR, RECEIVED_COLOR } from "jest-matcher-utils"
import isEqual from "lodash.isequal"

const checkErrorInstance = (
  subject: unknown,
  ErrorClass: new (...args: any[]) => Error,
  expectedProps?: Record<string, unknown>,
): jest.CustomMatcherResult => {
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

const toThrowMatching = (
  subject: unknown,
  ErrorClass: new (...args: any[]) => Error,
  expectedProps?: Record<string, unknown>,
): jest.CustomMatcherResult => {
  if (!(subject instanceof Function)) {
    return {
      pass: false,
      message: () =>
        `toThrowMatching requires a function, but received ${RECEIVED_COLOR(typeof subject)}. Use toMatchError to check an already-caught error.`,
    }
  }

  try {
    subject()
    return {
      pass: false,
      message: () =>
        `Expected function to throw ${EXPECTED_COLOR(ErrorClass.name)}, but it did not throw`,
    }
  } catch (e) {
    return checkErrorInstance(e, ErrorClass, expectedProps)
  }
}

const toMatchError = (
  subject: unknown,
  ErrorClass: new (...args: any[]) => Error,
  expectedProps?: Record<string, unknown>,
): jest.CustomMatcherResult => {
  if (subject instanceof Function) {
    return {
      pass: false,
      message: () =>
        `toMatchError requires an error instance, but received a function. Use toThrowMatching to assert on a throwing function.`,
    }
  }

  return checkErrorInstance(subject, ErrorClass, expectedProps)
}

expect.extend({
  toThrowMatching,
  toMatchError,
})
