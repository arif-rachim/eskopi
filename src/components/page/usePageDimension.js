import React, {createContext, useContext, useEffect} from "react";
import useObserver from "components/useObserver";

const PageDimensionContext = createContext(null);
const TOP_BAR_HEIGHT = 85;

export default function usePageDimension() {
    return useContext(PageDimensionContext);
}


export function PageDimensionProvider({pageRef, ...props}) {
    const [$dimension, setDimension] = useObserver(() => {
        if (pageRef.current) {
            return pageRef.current.getBoundingClientRect();
        }
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        return {width: vw, height: vh - TOP_BAR_HEIGHT, top: TOP_BAR_HEIGHT, left: 0};
    });
    useEffect(() => {
        const handleResize = () => setDimension(pageRef.current.getBoundingClientRect());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [pageRef, setDimension]);
    return <PageDimensionContext.Provider value={$dimension}>
        {props.children}
    </PageDimensionContext.Provider>
}