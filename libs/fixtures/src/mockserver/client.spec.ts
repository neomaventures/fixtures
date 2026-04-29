import { faker } from "@faker-js/faker"

import {
  type MockServerConfig,
  startMockServer,
  stopMockServer,
} from "../docker"

import {
  createExpectation,
  resetMockServer,
  verifyExpectationMatched,
} from "./client"
import { type MockserverExpectation } from "./types"

describe("MockServer client", () => {
  const prefix = `neoma-test-msc-${faker.string.alphanumeric(4)}`
  const port = 14_080 + faker.number.int({ min: 0, max: 899 })
  let config: MockServerConfig
  let baseUrl: string

  beforeAll(async () => {
    config = await startMockServer({ prefix, port })
    baseUrl = `http://localhost:${config.port}/mockserver`
  }, 60_000)

  afterAll(async () => {
    await stopMockServer({ prefix })
  })

  beforeEach(async () => {
    await resetMockServer(baseUrl)
  })

  describe("resetMockServer()", () => {
    it("should clear all expectations", async () => {
      const path = `/${faker.word.noun()}`

      await createExpectation(
        {
          httpRequest: { path, method: "GET" },
          httpResponse: { statusCode: 200, body: "ok" },
          times: { unlimited: true },
        },
        baseUrl,
      )

      // Confirm the expectation is active
      const before = await fetch(`http://localhost:${config.port}${path}`)
      expect(before.status).toBe(200)

      // Reset
      await resetMockServer(baseUrl)

      // After reset, the expectation should be gone (MockServer returns 404)
      const after = await fetch(`http://localhost:${config.port}${path}`)
      expect(after.status).toBe(404)
    })
  })

  describe("createExpectation()", () => {
    it("should register an expectation that responds correctly", async () => {
      const path = `/${faker.word.noun()}`
      const responseBody = JSON.stringify({ id: faker.string.uuid() })

      const expectation: MockserverExpectation = {
        httpRequest: { path, method: "GET" },
        httpResponse: { statusCode: 201, body: responseBody },
        times: { unlimited: true },
      }

      await createExpectation(expectation, baseUrl)

      const response = await fetch(`http://localhost:${config.port}${path}`)

      expect(response.status).toBe(201)
      expect(await response.text()).toBe(responseBody)
    })

    it("should respect specific times", async () => {
      const path = `/${faker.word.noun()}`

      const expectation: MockserverExpectation = {
        httpRequest: { path, method: "GET" },
        httpResponse: { statusCode: 200, body: "once" },
        times: { remainingTimes: 1 },
      }

      await createExpectation(expectation, baseUrl)

      const first = await fetch(`http://localhost:${config.port}${path}`)
      expect(first.status).toBe(200)

      const second = await fetch(`http://localhost:${config.port}${path}`)
      expect(second.status).toBe(404)
    })
  })

  describe("verifyExpectationMatched()", () => {
    it("should return true when a request was matched", async () => {
      const path = `/${faker.word.noun()}`

      await createExpectation(
        {
          httpRequest: { path, method: "GET" },
          httpResponse: { statusCode: 200, body: "ok" },
          times: { unlimited: true },
        },
        baseUrl,
      )

      await fetch(`http://localhost:${config.port}${path}`)

      const matched = await verifyExpectationMatched(
        { path, method: "GET" },
        baseUrl,
      )

      expect(matched).toBe(true)
    })

    it("should return false for unmatched requests", async () => {
      const path = `/${faker.word.noun()}`

      const matched = await verifyExpectationMatched(
        { path, method: "GET" },
        baseUrl,
      )

      expect(matched).toBe(false)
    })

    it("should support a custom count parameter", async () => {
      const path = `/${faker.word.noun()}`

      await createExpectation(
        {
          httpRequest: { path, method: "GET" },
          httpResponse: { statusCode: 200, body: "ok" },
          times: { unlimited: true },
        },
        baseUrl,
      )

      // Make the request three times
      await fetch(`http://localhost:${config.port}${path}`)
      await fetch(`http://localhost:${config.port}${path}`)
      await fetch(`http://localhost:${config.port}${path}`)

      const matchedThree = await verifyExpectationMatched(
        { path, method: "GET" },
        baseUrl,
        3,
      )
      expect(matchedThree).toBe(true)

      const matchedTwo = await verifyExpectationMatched(
        { path, method: "GET" },
        baseUrl,
        2,
      )
      expect(matchedTwo).toBe(false)
    })
  })
})
