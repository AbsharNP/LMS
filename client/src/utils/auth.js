const AUTH_USER_KEY = 'lms_user';
const FLASH_MESSAGE_KEY = 'lms_flash_message';

export const getAuthUser = () => {
  const savedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const setAuthUser = (user) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};

export const setFlashMessage = (message) => {
  localStorage.setItem(FLASH_MESSAGE_KEY, message);
};

export const consumeFlashMessage = () => {
  const message = localStorage.getItem(FLASH_MESSAGE_KEY);
  localStorage.removeItem(FLASH_MESSAGE_KEY);
  return message;
};
