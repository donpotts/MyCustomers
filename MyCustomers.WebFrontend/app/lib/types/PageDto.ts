/**
 * DTO representing a paginated response.
 * @template T The type of items contained in the page.
 */
export interface PageDto<T> {
  /** Total number of items available. */
  totalCount: number;

  /** The items for the current page. */
  items: T[];
}
