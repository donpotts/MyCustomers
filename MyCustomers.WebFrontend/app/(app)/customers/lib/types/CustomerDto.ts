/**
 * Data transfer object representing a customer.
 */
export interface CustomerDto {
  /** The unique identifier for the customer. */
  id: string;

  /** The name of the customer. */
  name: string;

  /** The email of the customer. */
  email: string;

  /** The number of the customer. */
  number?: string | null;

  /** The notes of the customer. */
  notes?: string | null;

  /** The created date of the customer. */
  createdDate: string;

  /** The modified date of the customer. */
  modifiedDate: string;
}
