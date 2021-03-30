import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver, {useObserverMapper} from "components/useObserver";
import {createContext, useEffect, useRef} from "react";
import PageTreePanel from "module/page-designer/pages/PageTreePanel";
import ControlListPanel from "module/page-designer/controls/ControlListPanel";
import DesignerPanel from "module/page-designer/designer/DesignerPanel";
import PropertiesPanel from "module/page-designer/properties/PropertiesPanel";
import OutlinePanel from "./outline/OutlinePanel";
import ButtonGroup from "components/button/ButtonGroup";

export const DropListenerContext = createContext(null);
const MAIN_VIEW_TAB = [
    {id: 'design', label: 'Design'},
    {id: 'eventAndAction', label: 'Events and Actions'}
];

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

    const [$tabData] = useObserver(MAIN_VIEW_TAB);

    const [$selectedMainView, setSelectedMainView] = useObserver(MAIN_VIEW_TAB[0]);
    const $displayDesignerPanel = useObserverMapper($selectedMainView, selectedView => selectedView?.id === 'design');
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
                    <ButtonGroup $data={$tabData} $value={$selectedMainView}
                                 onChange={val => setSelectedMainView(val)}/>
                    <Vertical $visible={$displayDesignerPanel} height={'calc(100% - 20px)'}>
                        <DesignerPanel $data={$data}
                                       $selectedPage={$selectedPage}
                                       setData={setData}
                                       setSelectedController={setSelectedController}
                                       $selectedController={$selectedController}
                        />
                    </Vertical>
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




