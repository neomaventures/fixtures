import { type MockserverExpectation, type MockserverHttpRequest } from "./types"

/**
 * Resets all expectations on a MockServer instance.
 *
 * @param baseUrl - The base URL of the MockServer instance
 *   (e.g. `http://localhost:1080/mockserver`)
 *
 * @throws {Error} When the MockServer returns a non-2xx response
 *
 * @example
 * ```typescript
 * await resetMockServer("http://localhost:1080/mockserver")
 * ```
 */
export const resetMockServer = async (baseUrl: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/reset`, { method: "PUT" })

  if (!response.ok) {
    throw new Error(
      `Error resetting mock server ${baseUrl}: ${response.status}`,
    )
  }
}

/**
 * Registers an expectation (a request to match and a response to return)
 * on a MockServer instance.
 *
 * @param expectation - The expectation to register
 * @param baseUrl - The base URL of the MockServer instance
 *   (e.g. `http://localhost:1080/mockserver`)
 *
 * @throws {Error} When the MockServer returns a non-2xx response
 *
 * @example
 * ```typescript
 * await createExpectation({
 *   httpRequest: { path: "/api/users", method: "GET" },
 *   httpResponse: { statusCode: 200, body: "[]" },
 *   times: { unlimited: true },
 * }, "http://localhost:1080/mockserver")
 * ```
 */
export const createExpectation = async (
  expectation: MockserverExpectation,
  baseUrl: string,
): Promise<void> => {
  const response = await fetch(`${baseUrl}/expectation`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(expectation),
  })

  if (!response.ok) {
    throw new Error(
      `Error creating expectation on ${baseUrl}: ${response.status} ${await response.text()}`,
    )
  }
}

/**
 * Verifies that a specific request was made a certain number of times
 * against a MockServer instance.
 *
 * @param httpRequest - The request pattern to verify
 * @param baseUrl - The base URL of the MockServer instance
 *   (e.g. `http://localhost:1080/mockserver`)
 * @param count - The exact number of times the request should have been
 *   made. Defaults to `1`.
 *
 * @returns `true` if the request was matched exactly `count` times,
 *   otherwise `false`
 *
 * @example
 * ```typescript
 * const matched = await verifyExpectationMatched(
 *   { path: "/api/users", method: "GET" },
 *   "http://localhost:1080/mockserver",
 * )
 * ```
 */
export const verifyExpectationMatched = async (
  httpRequest: MockserverHttpRequest,
  baseUrl: string,
  count: number = 1,
): Promise<boolean> => {
  const response = await fetch(`${baseUrl}/verify`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      httpRequest,
      times: {
        atLeast: count,
        atMost: count,
      },
    }),
  })

  return response.ok
}
