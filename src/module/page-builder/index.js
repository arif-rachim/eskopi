import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver from "components/useObserver";
import {createContext, useRef} from "react";
import PagePanel from "module/page-builder/PagePanel";
import ControlPanel from "module/page-builder/ControlPanel";
import LayoutPanel from "module/page-builder/LayoutPanel";
import ControllerPropertiesPanel from "./ControllerPropertiesPanel";

export const SelectedControlContext = createContext();
export const DropListenerContext = createContext(null);
export default function PageBuilder() {
    const [$selectedPage, setSelectedPage] = useObserver();
    const dropListener = useRef();
    return <DropListenerContext.Provider value={dropListener}>
        <SelectedControlContext.Provider value={useObserver()}>
            <Vertical height={'100%'}>
                <Horizontal height={'100%'}>
                    <Vertical height={'100%'} width={200} color={"light"} bR={4}>
                        <PagePanel $selectedPage={$selectedPage} setSelectedPage={setSelectedPage}/>
                        <ControlPanel/>
                    </Vertical>
                    <Vertical flex={1}>
                        <LayoutPanel/>
                    </Vertical>
                    <Vertical width={200} color={"light"} brightness={-3}>
                        <ControllerPropertiesPanel/>
                    </Vertical>
                </Horizontal>
            </Vertical>
        </SelectedControlContext.Provider>
    </DropListenerContext.Provider>
}

PageBuilder.title = 'Page Builder';



