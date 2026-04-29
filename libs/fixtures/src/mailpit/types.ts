/**
 * A typed client for the Mailpit REST API, designed for use in
 * integration and e2e tests.
 */
export interface MailpitClient {
  /**
   * Deletes all messages from Mailpit.
   *
   * @returns A promise that resolves when all messages have been cleared
   */
  clear(): Promise<void>

  /**
   * Retrieves all messages from Mailpit.
   *
   * @returns A promise that resolves to the messages list response
   */
  messages(): Promise<any>

  /**
   * Retrieves a single message by ID.
   *
   * @param id - The Mailpit message ID
   * @returns A promise that resolves to the full message details
   */
  message(id: string): Promise<any>

  /**
   * Finds the first message sent to a specific recipient.
   *
   * Performs a case-insensitive match on the recipient email address.
   *
   * @param email - The recipient email address to search for
   * @returns A promise that resolves to the full message details
   * @throws {Error} When no message is found for the given recipient
   */
  findByRecipient(email: string): Promise<any>
}
