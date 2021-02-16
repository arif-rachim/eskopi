import {createContext, useCallback, useContext} from "react";
import {createShowPanel} from "components/useLayers";
import useObserver, {ObserverValue} from "components/useObserver";

/**
 * @returns {function(*=): Promise<ValidationOptions.unknown>}
 */
export default function usePageLayers() {
    const setStacks = useContext(PageLayerContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(createShowPanel(setStacks), []);
}


const PageLayerContext = createContext({});

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function PageLayerContextProvider({children}) {
    const [$stacks, setStacks] = useObserver([]);
    return <PageLayerContext.Provider value={setStacks}>
        {children}
        <ObserverValue $observer={$stacks}
                       render={({value}) => value.map((stack) => <Layer key={stack.key}>{stack.panel}</Layer>)}/>
    </PageLayerContext.Provider>
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
