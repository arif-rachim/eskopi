import {createContext, useCallback, useContext} from "react";
import useObserver, {ObserverValue} from "components/useObserver";
import {uuid} from "components/utils";

/**
 *
 * @returns {function(*=): Promise<any>}
 */
export default function useLayers() {
    const setStacks = useContext(LayerContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(createShowPanel(setStacks), []);
}

/**
 *
 * @param setStacks
 * @returns {function(*=): Promise<any>}
 */
export function createShowPanel(setStacks) {
    return (panelCreatorFunction) => {
        return new Promise(resolve => {
            const key = uuid();
            new Promise(closePanel => {
                const panel = panelCreatorFunction(closePanel);
                setStacks(stacks => [...stacks, {key, panel}]);
            }).then(result => {
                setStacks(stacks => stacks.filter(s => s.key !== key));
                resolve(result);
            })
        });
    };
}

const LayerContext = createContext({});

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function LayerContextProvider({children}) {
    const [$stacks, setStacks] = useObserver([]);
    return <LayerContext.Provider value={setStacks}>
        {children}
        <ObserverValue $observers={$stacks}>
            {(stacks) => {
                return stacks.map((stack) => <Layer key={stack.key}>{stack.panel}</Layer>)
            }}
        </ObserverValue>
    </LayerContext.Provider>
}

/**
 *
 * @param children
 * @returns {*}
 * @constructor
 */
function Layer({children}) {
    return children
}
