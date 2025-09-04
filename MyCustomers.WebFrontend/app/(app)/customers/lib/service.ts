import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  updateResource,
} from "@/app/lib/service";
import { getServiceEndpoint } from "@/app/lib/service-discovery";
import type { CreateUpdateCustomerDto } from "./types/CreateUpdateCustomerDto";
import type { CustomerDto } from "./types/CustomerDto";

/**
 * Creates a new customer.
 * @param dto The data to create the customer with.
 * @returns The created customer.
 */
export const createCustomer = (dto: CreateUpdateCustomerDto) =>
  createResource<CreateUpdateCustomerDto, CustomerDto>(
    `${getServiceEndpoint("webapi")}/api/customers`,
    dto,
  );

/**
 * Gets a list of customers.
 * @param skip The number of items to skip (for pagination).
 * @param take The maximum number of items to take (for pagination).
 * @returns The list of customers.
 */
export const listCustomers = (skip?: number, take?: number) =>
  listResources<CustomerDto>(
    `${getServiceEndpoint("webapi")}/api/customers`,
    skip,
    take,
  );

/**
 * Gets a customer by its ID.
 * @param id The ID of the customer to retrieve.
 * @returns The customer with the specified ID.
 */
export const getCustomer = (id: string) =>
  getResource<CustomerDto>(
    `${getServiceEndpoint("webapi")}/api/customers/${id}`,
  );

/**
 * Updates an existing customer.
 * @param id The ID of the customer to update.
 * @param dto The data to update the customer with.
 * @returns The updated customer.
 */
export const updateCustomer = (id: string, dto: CreateUpdateCustomerDto) =>
  updateResource<CreateUpdateCustomerDto, CustomerDto>(
    `${getServiceEndpoint("webapi")}/api/customers/${id}`,
    dto,
  );

/**
 * Deletes a customer.
 * @param id The ID of the customer to delete.
 * @returns The result of the delete operation.
 */
export const deleteCustomer = (id: string) =>
  deleteResource(`${getServiceEndpoint("webapi")}/api/customers/${id}`);
