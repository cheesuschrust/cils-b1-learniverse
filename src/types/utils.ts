
/**
 * Normalized field mappings for supporting conversion between naming conventions
 */
export function normalizeFields<T extends Record<string, any>>(data: T): T {
  const mappings: Record<string, string> = {
    photo_url: 'photoURL',
    display_name: 'displayName',
    first_name: 'firstName',
    last_name: 'lastName',
    is_verified: 'isVerified',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    last_login: 'lastLogin',
    last_active: 'lastActive',
    phone_number: 'phoneNumber',
    preferred_language: 'preferredLanguage'
  };

  return Object.entries(data).reduce((acc, [key, value]) => {
    const newKey = mappings[key] || key;
    return { ...acc, [newKey]: value };
  }, {} as T);
}

export default {
  normalizeFields
};
