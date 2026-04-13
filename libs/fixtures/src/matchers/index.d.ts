export {}

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Checks if a function throws an instance of an error class, optionally
       * with specific properties.
       *
       * @param ErrorClass The expected error class/constructor
       * @param expectedProps Optional object of properties to match
       */
      toThrowMatching<T>(
        ErrorClass: new (...args: any[]) => T,
        expectedProps?: Partial<T>,
      ): R

      /**
       * Checks if a value is an instance of an error class, optionally
       * with specific properties.
       *
       * @param ErrorClass The expected error class/constructor
       * @param expectedProps Optional object of properties to match
       */
      toMatchError<T>(
        ErrorClass: new (...args: any[]) => T,
        expectedProps?: Partial<T>,
      ): R
    }
  }
}
