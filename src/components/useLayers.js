import {createContext,useState,useContext,useCallback} from "react";
import {v4} from "uuid";

/**
 *
 * @returns {function(*=): Promise<ValidationOptions.unknown>}
 */
export default function useLayers(){
    const setStacks = useContext(LayerContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(createShowPanel(setStacks),[]);
}

/**
 *
 * @param setStacks
 * @returns {function(*=): Promise<unknown>}
 */
function createShowPanel(setStacks) {
    const showPanel = (panelCreatorFunction) => {
        return new Promise(resolve => {
            const key = v4();
            new Promise(closePanel => {
                const panel = panelCreatorFunction(closePanel);
                setStacks(stacks => [...stacks, {key, panel}]);
            }).then(result => {
                setStacks(stacks => stacks.filter(s => s.key !== key));
                resolve(result);
            })
        });
    }
    return showPanel;
}

const LayerContext = createContext({});

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function LayerContextProvider({children}){
    const [stacks,setStacks] = useState([]);
    return <LayerContext.Provider value={setStacks}>
        {children}
        {stacks.map((stack) => {
            return <Layer key={stack.key}>{stack.panel}</Layer>
        })}
    </LayerContext.Provider>
}

/**
 *
 * @param children
 * @returns {*}
 * @constructor
 */
function Layer({children}){
    return children
}
