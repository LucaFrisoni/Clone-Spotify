// Decides which name and photo represent the user, and validates new usernames.

const DEFAULT_USERNAME = "Username";
const MAX_USERNAME_LENGTH = 16;
const MAX_SPECIAL_CHARACTERS = 2;

interface ProfileDetails {
  user_name?: string | null;
  avatar_url?: string | null;
}

interface AuthUser {
  email?: string | null;
  user_metadata?: Record<string, any>;
}

export interface ResolvedProfile {
  name: string;
  avatarPath: string | null;
  avatarUrl: string | null;
}

//La base pone "Username" por defecto, asi que ese valor cuenta como vacio
export const resolveProfile = (details: ProfileDetails | null, user: AuthUser | null): ResolvedProfile => {
  const metadata = user?.user_metadata ?? {};
  const savedName = details?.user_name !== DEFAULT_USERNAME ? details?.user_name : null;
  const name =
    savedName || metadata.user_name || metadata.full_name || user?.email?.split("@")[0] || "User";

  return {
    name,
    avatarPath: details?.avatar_url || null,
    avatarUrl: details?.avatar_url ? null : metadata.avatar_url ?? null,
  };
};

export const validateUsername = (name: string) => {
  if (name.length > MAX_USERNAME_LENGTH) {
    return `Username cannot be longer than ${MAX_USERNAME_LENGTH} characters`;
  }
  const specialCharacters = (name.match(/[^\w]/g) ?? []).length;
  if (specialCharacters > MAX_SPECIAL_CHARACTERS) {
    return `Username must contain a maximum of ${MAX_SPECIAL_CHARACTERS} special characters`;
  }
  return null;
};
