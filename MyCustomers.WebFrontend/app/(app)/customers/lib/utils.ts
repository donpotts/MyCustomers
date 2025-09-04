/**
 * Parses form data from a FormData object.
 * @param formData The FormData object to parse.
 * @returns An object containing the parsed form data.
 */
export function parseFormData(formData: FormData) {
  return {
    name: formData.get("name") ?? undefined,
    email: formData.get("email") ?? undefined,
    number: formData.get("number") || undefined,
    notes: formData.get("notes") || undefined,
    createdDate: formData.get("createdDate") ?? undefined,
    modifiedDate: formData.get("modifiedDate") ?? undefined,
  };
}
