const AUTH_KEY = "studybuddy_auth";

export interface MockUser {
  email: string;
  name: string;
}

interface AuthData {
  isLoggedIn: boolean;
  user: MockUser | null;
}

export const getAuthData = (): AuthData => {
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return { isLoggedIn: false, user: null };
  try {
    return JSON.parse(data) as AuthData;
  } catch {
    return { isLoggedIn: false, user: null };
  }
};

export const isLoggedIn = (): boolean => {
  return getAuthData().isLoggedIn;
};

export const getCurrentUser = (): MockUser | null => {
  return getAuthData().user;
};

export const login = (email: string, password: string): boolean => {
  // Mock validation - in real app this would hit an API
  if (email && password.length >= 6) {
    const authData: AuthData = {
      isLoggedIn: true,
      user: {
        email,
        name: email.split("@")[0],
      },
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return true;
  }
  return false;
};

export const signup = (email: string, password: string): boolean => {
  // Mock signup - same as login for demo purposes
  return login(email, password);
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};
