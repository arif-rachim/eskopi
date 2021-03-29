import React, {useCallback, useContext, useRef} from "react";
import routing from "routing";
import {Horizontal, Vertical} from "components/layout/Layout";

export const NavigationContext = React.createContext(() => {
});
export const ElementToMountContext = React.createContext({});

export default function useNavigation() {
    return useContext(NavigationContext);
}

export function NavigationContextProvider({children}) {
    const navigationListenersRef = useRef([]);

    const navigateTo = useCallback((hash) => {
        const elementToMount = getElementToMount(hash);
        navigationListenersRef.current.forEach(callback => callback.call(null, elementToMount));
    }, []);

    const addListener = useCallback((listener) => {
        navigationListenersRef.current.push(listener);
        return function removeListener() {
            navigationListenersRef.current.splice(navigationListenersRef.current.indexOf(listener), 1);
        }
    }, []);

    return <NavigationContext.Provider value={navigateTo}>
        <ElementToMountContext.Provider value={addListener}>
            {children}
        </ElementToMountContext.Provider>
    </NavigationContext.Provider>
}


export function findMostMatchingComponent(pathArray, routing) {
    const keys = Object.keys(routing);
    const paths = [...pathArray];
    for (let i = paths.length; i >= 0; i--) {
        const pathMatch = paths.join('/');
        if (keys.indexOf(pathMatch) >= 0) {
            pathArray = pathArray.slice(i, pathArray.length);
            return {Element: routing[pathMatch], params: pathArray, key: pathMatch}
        }
        paths.splice(i - 1, 1);
    }
    return {Element: InvalidRoute, params: [], key: pathArray.join('/')};

}

export function getElementToMount(hash) {
    if (hash && hash.length > 0) {
        const path = hash.substr(1, hash.length - 1);
        const pathArray = path.split('/');
        const component = findMostMatchingComponent(pathArray, routing);
        return component;
    }
    if ('' in routing) {
        return {Element: routing[''], params: {}};
    }
    return {Element: EmptyElement, params: {}};
}

function InvalidRoute({route}) {
    return <Vertical hAlign={'center'} vAlign={'center'}>
        <Vertical>
            <Horizontal style={{fontSize: 30}}>Something went wrong !</Horizontal>
            <Horizontal><code><b>{route}</b></code> does not exist.</Horizontal>
        </Vertical>
    </Vertical>
}

function EmptyElement() {
    return <Vertical>Nothing here ...</Vertical>
}