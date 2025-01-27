const TOKEN_KEY = "auth_token";

export const getToken = (): string | null => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token ? token : null;
};

export const setToken = (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
    sessionStorage.removeItem(TOKEN_KEY);
};
