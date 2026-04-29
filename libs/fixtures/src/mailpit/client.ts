import { type MailpitClient } from "./types"

/**
 * Parses a Mailpit API response, throwing a descriptive error on non-2xx
 * status codes or non-JSON bodies.
 *
 * @param res - The fetch response to parse
 * @param label - A human-readable label for error messages
 * @returns The parsed JSON body
 * @throws {Error} When the response status is not OK or the body is not valid JSON
 */
async function parseResponse(res: Response, label: string): Promise<any> {
  const text = await res.text()

  if (!res.ok) {
    throw new Error(`Mailpit ${label} returned ${res.status}: ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(
      `Mailpit ${label} returned non-JSON (${res.status}): ${text}`,
    )
  }
}

/**
 * Creates a typed Mailpit API client bound to the given base URL.
 *
 * The client provides methods for interacting with the Mailpit REST API:
 * clearing messages, listing messages, fetching individual messages, and
 * finding messages by recipient.
 *
 * @param baseUrl - The Mailpit API v1 base URL (e.g. `http://localhost:8025/api/v1`)
 * @returns A {@link MailpitClient} instance
 *
 * @example
 * ```typescript
 * import { createMailpitClient } from "@neoma/fixtures/mailpit"
 *
 * const client = createMailpitClient("http://localhost:8025/api/v1")
 *
 * // Clear all messages
 * await client.clear()
 *
 * // List all messages
 * const { messages } = await client.messages()
 *
 * // Find a message by recipient
 * const msg = await client.findByRecipient("user@example.com")
 * console.log(msg.Subject, msg.HTML)
 * ```
 */
export function createMailpitClient(baseUrl: string): MailpitClient {
  const client: MailpitClient = {
    clear: async (): Promise<void> => {
      const res = await fetch(`${baseUrl}/messages`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(
          `Mailpit /messages DELETE returned ${res.status}: ${text}`,
        )
      }
    },

    messages: async (): Promise<any> => {
      const res = await fetch(`${baseUrl}/messages`)
      return parseResponse(res, "/messages")
    },

    message: async (id: string): Promise<any> => {
      const res = await fetch(`${baseUrl}/message/${id}`)
      return parseResponse(res, `/message/${id}`)
    },

    findByRecipient: async (email: string): Promise<any> => {
      const { messages } = await client.messages()
      const match = messages.find((m: any) =>
        m.To.some(
          (to: any) => to.Address.toLowerCase() === email.toLowerCase(),
        ),
      )
      if (!match) {
        throw new Error(`No email found for recipient: ${email}`)
      }
      return client.message(match.ID as string)
    },
  }

  return client
}
