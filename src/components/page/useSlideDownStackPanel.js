import {createContext, useCallback, useContext, useRef} from "react";
import useSlideDownPanel from "components/page/useSlideDownPanel";

export default function useSlideDownStackPanel(animationDuration = 300) {
    const showSlideDown = useSlideDownPanel(animationDuration);
    const layers = useContext(SlideDownStackPanelContext);
    return useCallback((render) => new Promise(resolve => {
        const Render = render;
        const actionRef = {current: {}};
        if (layers.current.length > 0) {
            const {setShowPanel} = layers.current[layers.current.length - 1].current;
            setShowPanel(false);
        }
        const promise = showSlideDown(({closePanel}) => <Render closePanel={closePanel}/>, {
            actionRef,
            showOverlayLayer: layers.current.length === 0
        });
        layers.current.push(actionRef);
        promise.then(value => {
            layers.current.splice(layers.current.indexOf(actionRef), 1);
            resolve(value);
            if (layers.current.length > 0) {
                const {setShowPanel} = layers.current[layers.current.length - 1].current;
                setShowPanel(true);
            }
        });
    }), [showSlideDown, layers]);
}

const SlideDownStackPanelContext = createContext([]);

export function SlideDownStackPanelContextProvider({children}) {
    const actionRef = useRef([]);
    return <SlideDownStackPanelContext.Provider value={actionRef}>
        {children}
    </SlideDownStackPanelContext.Provider>
}