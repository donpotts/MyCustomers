import { Customer, CreateUpdateCustomerDto, PagedResponse } from '../types/Customer';
import { apiClient } from './apiClient';

export class CustomerService {
  async getCustomers(skip?: number, take?: number): Promise<Customer[]> {
    try {
      // The backend enforces a maximum page size (AppServiceConstants.MaxPageSize = 100).
      // Some clients request a very large `take` (e.g. 1000) to get all records; the server
      // will clamp that. To ensure the RN app receives all customers, page through the
      // API in chunks and accumulate results until we reach totalCount.
      const MAX_PAGE_SIZE = 100; // keep in sync with backend AppServiceConstants.MaxPageSize

      // If take is provided and small enough, do a single request.
      if (take !== undefined && take > 0 && take <= MAX_PAGE_SIZE) {
        const params = new URLSearchParams();
        if (skip !== undefined) params.append('skip', skip.toString());
        params.append('take', take.toString());
        const queryString = params.toString();
        const endpoint = queryString ? `/api/customers?${queryString}` : '/api/customers';
        const response = await apiClient.get<PagedResponse<Customer>>(endpoint);
        return response.items || [];
      }

      // Otherwise, fetch all pages in a loop using MAX_PAGE_SIZE per request.
      const allItems: Customer[] = [];
      let currentSkip = skip ?? 0;
      let totalCount: number | null = null;
      const safetyLimit = 1000; // avoid infinite loops (1000 * 100 = 100k items)
      let iterations = 0;

      while (true) {
        iterations++;
        if (iterations > safetyLimit) break;

        const params = new URLSearchParams();
        params.append('skip', currentSkip.toString());
        params.append('take', MAX_PAGE_SIZE.toString());
        const endpoint = `/api/customers?${params.toString()}`;

        const response = await apiClient.get<PagedResponse<Customer>>(endpoint);
        const items = response?.items || [];
        if (items.length > 0) {
          allItems.push(...items);
        }

        // Set totalCount from the first response
        if (totalCount === null) {
          totalCount = response?.totalCount ?? null;
        }

        currentSkip += items.length;

        // Stop when we've fetched all known items, or when a request returned no items
        if ((totalCount !== null && allItems.length >= totalCount) || items.length === 0) {
          break;
        }
      }

      return allItems;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    try {
      return await apiClient.get<Customer>(`/api/customers/${id}`);
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  }

  async createCustomer(customerData: Omit<CreateUpdateCustomerDto, 'createdDate' | 'updatedDate'>): Promise<Customer> {
    try {
      const now = new Date().toISOString();
      const customer: CreateUpdateCustomerDto = {
        ...customerData,
        createdDate: now,
        updatedDate: now,
      };

      return await apiClient.post<Customer>('/api/customers', customer);
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, customerData: Omit<CreateUpdateCustomerDto, 'createdDate'>): Promise<Customer> {
    try {
      const customer: Omit<CreateUpdateCustomerDto, 'createdDate'> = {
        ...customerData,
        updatedDate: new Date().toISOString(),
      };

      return await apiClient.put<Customer>(`/api/customers/${id}`, customer);
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/customers/${id}`);
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }
}

export const customerService = new CustomerService();