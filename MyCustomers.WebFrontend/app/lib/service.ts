import { auth } from "@/auth";
import { MAX_ITEMS_PER_PAGE } from "./constants";
import type { ApiResult } from "./types/ApiResult";
import type { PageDto } from "./types/PageDto";

/**
 * Gets a list of resources.
 * @param url The URL to fetch the resources from.
 * @param skip The number of items to skip (for pagination).
 * @param take The maximum number of items to take (for pagination).
 * @returns The list of resources.
 */
export async function listResources<TResult>(
  url: string,
  skip?: number,
  take?: number,
): Promise<ApiResult<PageDto<TResult>>> {
  const params = new URLSearchParams();
  if (skip !== undefined) {
    if (skip < 0) {
      throw new Error("Skip must be a non-negative integer.");
    }

    params.set("skip", String(skip));
  }

  if (take !== undefined) {
    if (take < 1 || take > MAX_ITEMS_PER_PAGE) {
      throw new Error("Take must be between 1 and 100.");
    }

    params.set("take", String(take));
  }

  const queryString = params.toString();

  const session = await auth();
  const accessToken = session?.accessToken;

  const response = await fetch(`${url}?${queryString}`, {
    cache: "no-store",
    ...(accessToken && {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: {
        status: response.status,
        details: await response.json().catch(() => undefined),
      },
    };
  }

  return {
    success: true,
    data: await response.json(),
  };
}

/**
 * Gets a resource.
 * @param url The URL of the resource to retrieve.
 * @returns The resource.
 */
export async function getResource<TResult>(
  url: string,
): Promise<ApiResult<TResult>> {
  const session = await auth();
  const accessToken = session?.accessToken;

  const response = await fetch(url, {
    cache: "no-store",
    ...(accessToken && {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: {
        status: response.status,
        details: await response.json().catch(() => undefined),
      },
    };
  }

  return {
    success: true,
    data: await response.json(),
  };
}

/**
 * Creates a new resource.
 * @param url The URL to send the request to.
 * @param dto The data to create the resource with.
 * @returns The created resource.
 */
export async function createResource<TDto, TResult>(
  url: string,
  dto: TDto,
): Promise<ApiResult<TResult>> {
  const session = await auth();
  const accessToken = session?.accessToken;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
    },
    body: JSON.stringify(dto),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      success: false,
      error: {
        status: response.status,
        details: await response.json().catch(() => undefined),
      },
    };
  }

  return {
    success: true,
    data: await response.json(),
  };
}

/**
 * Updates an existing resource.
 * @param url The URL to send the request to.
 * @param dto The data to update the resource with.
 * @returns The updated resource.
 */
export async function updateResource<TDto, TResult>(
  url: string,
  dto: TDto,
): Promise<ApiResult<TResult>> {
  const session = await auth();
  const accessToken = session?.accessToken;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
    },
    body: JSON.stringify(dto),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      success: false,
      error: {
        status: response.status,
        details: await response.json().catch(() => undefined),
      },
    };
  }

  return {
    success: true,
    data: await response.json(),
  };
}

/**
 * Deletes a resource.
 * @param url The URL of the resource to delete.
 * @returns The result of the delete operation.
 */
export async function deleteResource(
  url: string,
): Promise<ApiResult<undefined>> {
  const session = await auth();
  const accessToken = session?.accessToken;

  const response = await fetch(url, {
    method: "DELETE",
    cache: "no-store",
    ...(accessToken && {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: {
        status: response.status,
        details: await response.json().catch(() => undefined),
      },
    };
  }

  return {
    success: true,
    data: undefined,
  };
}
