export function getInitials(
  name?: string | null,
  email?: string | null
): string {
  if (name && name.trim().length > 0) {
    return name.trim().slice(0, 2).toUpperCase();
  }
  if (email && email.trim().length > 0) {
    const localPart = email.split("@")[0];
    if (localPart) return localPart.slice(0, 2).toUpperCase();
  }
  return "U";
}
