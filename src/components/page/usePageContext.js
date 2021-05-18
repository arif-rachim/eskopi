import {createContext, useContext} from "react";
import useObserver from "components/useObserver";

const PageContext = createContext({});

export default function usePageContext() {
    return useContext(PageContext);
}

export function PageContextProvider({children}) {
    return <PageContext.Provider value={useObserver({})}>
        {children}
    </PageContext.Provider>
}