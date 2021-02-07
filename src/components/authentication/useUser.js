import {createContext, useContext} from "react";
import useStateObserver, {useObserverValue} from "components/useStateObserver";


const UserContext = createContext({});
export const EMPTY_USER = {};

/**
 * Hook to get the current user
 * @returns {[*, *]}
 */
export default function useUser() {
    const [userO, setUser] = useContext(UserContext);
    return [userO, setUser];
}

/**
 * Hook to hold the current user
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function UserProvider({children}) {
    const [userO, setUser] = useStateObserver(EMPTY_USER);
    return <UserContext.Provider value={[userO, setUser]}>
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
    const [userO] = useUser();
    const user = useObserverValue(userO);
    if (user === EMPTY_USER) {
        return fallback;
    }
    return children;
}