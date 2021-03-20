import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver from "components/useObserver";
import {createContext, useEffect, useRef} from "react";
import PageTreePanel from "module/page-builder/pages/PageTreePanel";
import ControlListPanel from "module/page-builder/controls/ControlListPanel";
import DesignerPanel from "module/page-builder/designer/DesignerPanel";
import PropertiesPanel from "module/page-builder/properties/PropertiesPanel";
import OutlinePanel from "./outline/OutlinePanel";

export const DropListenerContext = createContext(null);
export default function PageBuilder({setTitle}) {
    useEffect(() => setTitle('Page Builder'), [setTitle]);
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
                    <DesignerPanel $data={$data}
                                   $selectedPage={$selectedPage}
                                   setData={setData}
                                   setSelectedController={setSelectedController}
                                   $selectedController={$selectedController}
                    />
                </Vertical>
                <Vertical width={265} color={"light"} brightness={0.5}>
                    <Vertical height={'50%'}>
                        <PropertiesPanel
                            $layout={$data}
                            setLayout={setData}
                            $selectedController={$selectedController}
                        />
                    </Vertical>
                    <Vertical height={'50%'}>
                        <OutlinePanel $data={$data}
                                      setData={setData}
                                      $selectedController={$selectedController}
                                      setSelectedController={setSelectedController}
                        />
                    </Vertical>
                </Vertical>
            </Horizontal>
        </Vertical>
    </DropListenerContext.Provider>
}

PageBuilder.title = 'Page Builder';



