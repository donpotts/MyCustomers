/**
 * Retrieves the endpoint URL for a given service name from environment variables.
 *
 * Checks for both HTTPS and HTTP endpoints using the following environment variable patterns:
 * - services__{serviceName}__https__0
 * - services__{serviceName}__http__0
 *
 * @param serviceName - The name of the service to look up.
 * @returns The endpoint URL as a string, or undefined if not found.
 */
export function getServiceEndpoint(serviceName: string) {
  return (
    process.env[`services__${serviceName}__https__0`] ??
    process.env[`services__${serviceName}__http__0`]
  );
}
