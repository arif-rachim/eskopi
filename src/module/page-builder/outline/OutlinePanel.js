import Panel from "../../../components/panel/Panel";
import Tree from "components/tree/Tree";
import {Horizontal, Vertical} from "components/layout/Layout";
import {useObserverMapper} from "components/useObserver";
import {ControlsNaming} from "module/page-builder/controls/ControllerMapper";
import {useContext, useState} from "react";
import {DropListenerContext} from "module/page-builder/index";

export default function OutlinePanel({$data, setData, $selectedController, setSelectedController}) {
    return <Panel headerTitle={'Outline'}>
        <Tree $data={useObserverMapper($data, data => data.children)}
              $selectedItem={$selectedController}
              setSelectedItem={setSelectedController}
              itemRenderer={OutlineItemRenderer}
              setData={setData}
        />
    </Panel>
}

const handleDragStart = (setIsDragging, data, dropListener) => (event) => {
    event.stopPropagation();
    setIsDragging(true);
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', JSON.stringify(data));
    dropListener.current = () => {
        setIsDragging(false);
    };
}
const handleDragEnd = (setIsDragging) => (event) => {
    setIsDragging(false);
}

function OutlineItemRenderer(props) {
    const [isDragging, setIsDragging] = useState();
    const dropListener = useContext(DropListenerContext);
    return <Horizontal opacity={isDragging ? 0.5 : 1}>
        <Vertical vAlign={'center'} pT={0.5} flex={1} draggable={true}
                  onDragStart={handleDragStart(setIsDragging, props.data, dropListener)}
                  onDragEnd={handleDragEnd(setIsDragging)}
        >
            {ControlsNaming[props.data.type]}
        </Vertical>
    </Horizontal>

}