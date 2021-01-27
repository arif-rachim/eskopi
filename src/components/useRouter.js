import {createContext, useContext, useEffect, useState} from "react";
import routing from "../routing";
import {Horizontal, Vertical} from "./layout/Layout";

const RoutingContext = createContext({});

export default function useRouter() {
    const elementToMount = useContext(RoutingContext);
    return elementToMount;
}

function findMostMatchingComponent(pathArray, routing) {
    let allMatchCriteria = [];
    for (const routingKey of Object.keys(routing)) {
        const routingKeyArray = routingKey.split('/');
        const routingAndPathLengthAreEqual = routingKeyArray.length === pathArray.length;
        if (routingAndPathLengthAreEqual) {
            const paramMatcher = routingKeyArray.reduce((accumulator, routeToken, index) => {
                const isDynamic = routeToken.indexOf('@') === 0;
                if (isDynamic) {
                    const path = routeToken.substr(1, routeToken.length - 1);
                    return {
                        ...accumulator,
                        params: {...accumulator.params, [path]: pathArray[index]}
                    };
                }
                /// we need to get the params here
                const match = accumulator.match && routeToken === pathArray[index]
                return {...accumulator, match, totalMatch: match ? accumulator.totalMatch + 1 : accumulator.totalMatch}
            }, {match: true, totalMatch: 0, params: {}});
            if (paramMatcher.match) {
                allMatchCriteria.push({
                    pathMap: routingKey,
                    score: paramMatcher.totalMatch,
                    params: paramMatcher.params
                });
            }
        }
    }
    if (allMatchCriteria.length === 0) {
        return {Element: InvalidRoute, params: {route: pathArray.join('/')}};
    }
    const mostMatchingMap = allMatchCriteria.sort((a, b) => a.score === b.score ? 0 : a.score > b.score ? -1 : 1)[0];
    return {Element: routing[mostMatchingMap.pathMap], params: mostMatchingMap.params};
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
    const [elementToMount, setElementToMount] = useState(getElementToMount());

    useEffect(() => {
        const handleHashChange = () => setElementToMount(getElementToMount());
        window.addEventListener("hashchange", handleHashChange);
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        }
    }, []);

    return <RoutingContext.Provider value={elementToMount}>
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