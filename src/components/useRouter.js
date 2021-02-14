import {createContext, useContext, useEffect} from "react";
import routing from "../routing";
import {Horizontal, Vertical} from "./layout/Layout";
import useObserver from "./useObserver";

const RoutingContext = createContext({});

export default function useRouter() {
    return useContext(RoutingContext);
}

export function findMostMatchingComponent(pathArray, routing) {
    const keys = Object.keys(routing);
    const paths = [...pathArray];
    for (let i = paths.length; i >= 0; i--) {
        const pathMatch = paths.splice(i - 1, 1).join('/');
        if (keys.indexOf(pathMatch) >= 0) {
            pathArray = pathArray.slice(i,pathArray.length);
            return {Element: routing[pathMatch], params: pathArray, key: pathMatch}
        }
    }
    return {Element: InvalidRoute, params:[],key:pathArray.join('/')};

}

function getElementToMount() {
    const hash = window.location.hash;
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

export function RouterProvider({children}) {
    const [$elementToMount, setElementToMount] = useObserver(getElementToMount());

    useEffect(() => {
        const handleHashChange = () => setElementToMount(getElementToMount());
        window.addEventListener("hashchange", handleHashChange);
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        }
    }, [setElementToMount]);

    return <RoutingContext.Provider value={$elementToMount}>
        {children}
    </RoutingContext.Provider>;
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