const STORE_NAME = 'grior_user';
let currentUser;

const getAuthenticatedUser = () => {
    if (currentUser !== undefined) return currentUser;

    let serializedUser = localStorage.getItem(STORE_NAME);
    if (!serializedUser) {
        serializedUser = sessionStorage.getItem(STORE_NAME);
    }
    if (!serializedUser) return undefined;

    currentUser = JSON.parse(serializedUser);
    return currentUser;
};

const setAuthenticatedUser = (authenticatedUser, rememberME) => {
    if (rememberME) {
        localStorage.setItem(STORE_NAME, JSON.stringify(authenticatedUser));
    } else {
        sessionStorage.setItem(STORE_NAME, JSON.stringify(authenticatedUser));
    }

    currentUser = authenticatedUser;
};

const isAuthenticated = () => {
    if (currentUser !== undefined && currentUser !== null) {
        return true;
    }

    if (localStorage.getItem(STORE_NAME) !== null || sessionStorage.getItem(STORE_NAME) !== null) {
        return true;
    }
    return false;
}

const clearAuthenticatedUser = () => {
    localStorage.removeItem(STORE_NAME);
    sessionStorage.removeItem(STORE_NAME);
    currentUser = undefined;
}

// eslint-disable-next-line object-curly-newline
export { getAuthenticatedUser, setAuthenticatedUser, isAuthenticated, clearAuthenticatedUser };
