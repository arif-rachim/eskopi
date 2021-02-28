import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver from "components/useObserver";
import {createContext, useRef} from "react";
import PageTreePanel from "module/page-builder/pages/PageTreePanel";
import ControlListPanel from "module/page-builder/controls/ControlListPanel";
import PageEditorPanel from "module/page-builder/page/PageEditorPanel";
import PropertiesPanel from "module/page-builder/properties/PropertiesPanel";

export const DropListenerContext = createContext(null);
export default function PageBuilder() {
    const [$selectedPage, setSelectedPage] = useObserver();
    const [$data, setData] = useObserver({});
    const [$selectedController, setSelectedController] = useObserver();
    const dropListener = useRef();
    return <DropListenerContext.Provider value={dropListener}>

        <Vertical height={'100%'}>
            <Horizontal height={'100%'}>
                <Vertical height={'100%'} width={200} color={"light"} bR={4}>
                    <PageTreePanel $selectedPage={$selectedPage} setSelectedPage={setSelectedPage}/>
                    <ControlListPanel/>
                </Vertical>
                <Vertical flex={1}>
                    <PageEditorPanel $data={$data} setData={setData} setSelectedController={setSelectedController}/>
                </Vertical>
                <Vertical width={200} color={"light"} brightness={-3}>
                    <PropertiesPanel
                        $layout={$data}
                        setLayout={setData}
                        $selectedController={$selectedController}
                    />
                </Vertical>
            </Horizontal>
        </Vertical>
    </DropListenerContext.Provider>
}

PageBuilder.title = 'Page Builder';



