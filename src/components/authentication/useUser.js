import {createContext, useCallback, useContext} from "react";
import useObserver, {useObserverValue} from "components/useObserver";
import {isFunction} from "components/utils";


const UserContext = createContext({});
export const EMPTY_USER = {};
export const USER_KEY = 'active_user'
/**
 * Hook to get the current user
 * @returns {[*, *]}
 */
export default function useUser() {
    const [$user, setUser] = useContext(UserContext);
    return [$user, setUser];
}

/**
 * Hook to hold the current user
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function UserProvider({children}) {
    const [$user, _setUser] = useObserver(() => {
        const user = window.localStorage.getItem(USER_KEY);
        if (user) {
            return JSON.parse(user);
        }
        return EMPTY_USER;
    });
    const setUser = useCallback((user) => {
        if (user === null) {
            return window.localStorage.removeItem(USER_KEY);
        }
        const oldUser = $user.current;
        let newUser = user;
        if (isFunction(user)) {
            newUser = user.apply(null, [oldUser]);
        }
        window.localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        _setUser(newUser);
    }, [$user, _setUser]);
    return <UserContext.Provider value={[$user, setUser]}>
        {children}
    </UserContext.Provider>
}

/**
 * Hook to validate if current user is exist
 * @param fallback
 * @param children
 * @returns {*}
 * @constructor
 */
export function AuthCheck({fallback, children}) {
    const [$user] = useUser();
    const user = useObserverValue($user);
    if (user === EMPTY_USER) {
        return fallback;
    }
    return children;
}