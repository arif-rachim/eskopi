import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver from "components/useObserver";
import {createContext, useEffect, useRef} from "react";
import PageTreePanel from "module/page-designer/pages/PageTreePanel";
import ControlListPanel from "module/page-designer/controls/ControlListPanel";
import DesignerPanel from "module/page-designer/designer/DesignerPanel";
import PropertiesPanel from "module/page-designer/properties/PropertiesPanel";
import OutlinePanel from "./outline/OutlinePanel";

export const DropListenerContext = createContext(null);


export default function PageDesigner({setTitle}) {
    useEffect(() => {
        if (setTitle) {
            setTitle('Designer');
        }
    }, [setTitle]);
    const [$selectedPage, setSelectedPage] = useObserver();
    const [$data, setData] = useObserver({});
    const [$selectedController, setSelectedController] = useObserver();
    const dropListener = useRef();
    return <DropListenerContext.Provider value={dropListener}>
        <Vertical height={'100%'}>
            <Horizontal height={'100%'}>
                <Vertical height={'100%'} width={200} color={"light"} bR={4} overflow={'auto'}>
                    <PageTreePanel $selectedPage={$selectedPage} setSelectedPage={setSelectedPage}/>
                    <ControlListPanel/>
                </Vertical>
                <Vertical>
                </Vertical>
                <Vertical flex={3}>
                    <DesignerPanel $data={$data}
                                   $selectedPage={$selectedPage}
                                   setData={setData}
                                   setSelectedController={setSelectedController}
                                   $selectedController={$selectedController}
                    />
                </Vertical>

                <Vertical width={265} bL={2}>
                    <PropertiesPanel
                        $layout={$data}
                        setLayout={setData}
                        $selectedController={$selectedController}
                    />
                </Vertical>
                <Vertical flex={1} bL={2}>
                    <OutlinePanel $data={$data}
                                  setData={setData}
                                  $selectedController={$selectedController}
                                  setSelectedController={setSelectedController}
                    />
                </Vertical>
            </Horizontal>
        </Vertical>
    </DropListenerContext.Provider>
}




