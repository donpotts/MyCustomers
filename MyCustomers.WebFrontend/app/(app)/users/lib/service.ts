import { getServiceEndpoint } from "@/app/lib/service-discovery";
import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  updateResource,
} from "@/app/lib/service";
import type { ApiResult } from "@/app/lib/types/ApiResult";
import type { PageDto } from "@/app/lib/types/PageDto";
import type { UserDto } from "@/app/lib/types/UserDto";
import type { CreateUpdateUserDto } from "./types/CreateUpdateUserDto";

const BASE_URL = `${getServiceEndpoint("webapi")}/api/users`;

/**
 * Gets a list of users.
 * @param skip The number of users to skip (for pagination).
 * @param take The maximum number of users to take (for pagination).
 * @returns The list of users.
 */
export async function listUsers(
  skip?: number,
  take?: number,
): Promise<ApiResult<PageDto<UserDto>>> {
  return listResources<UserDto>(BASE_URL, skip, take);
}

/**
 * Gets a user by ID.
 * @param id The ID of the user.
 * @returns The user.
 */
export async function getUserById(id: string): Promise<ApiResult<UserDto>> {
  return getResource<UserDto>(`${BASE_URL}/${id}`);
}

/**
 * Creates a new user.
 * @param dto The user data.
 * @returns The created user.
 */
export async function createUser(
  dto: CreateUpdateUserDto,
): Promise<ApiResult<UserDto>> {
  return createResource<CreateUpdateUserDto, UserDto>(BASE_URL, dto);
}

/**
 * Updates a user.
 * @param id The ID of the user to update.
 * @param dto The updated user data.
 * @returns The updated user.
 */
export async function updateUser(
  id: string,
  dto: Partial<CreateUpdateUserDto>,
): Promise<ApiResult<UserDto>> {
  return updateResource<Partial<CreateUpdateUserDto>, UserDto>(
    `${BASE_URL}/${id}`,
    dto,
  );
}

/**
 * Deletes a user.
 * @param id The ID of the user to delete.
 * @returns The result of the delete operation.
 */
export async function deleteUser(id: string): Promise<ApiResult<undefined>> {
  return deleteResource(`${BASE_URL}/${id}`);
}