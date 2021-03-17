import {Horizontal, Vertical} from "components/layout/Layout";
import {useContext, useState} from "react";
import {DropListenerContext} from "module/page-builder/index";
import Panel from "components/panel/Panel";
import {Controls, ControlsNaming, Icons} from "module/page-builder/controls/ControllerMapper";


export default function ControlListPanel() {
    return <Panel headerTitle={'Controls'}>
        <Vertical color={"light"} brightness={0.3}>
            <Vertical p={2} gap={3}>
                {Object.keys(Controls).map(control => {
                    const key = Controls[control];
                    return <DraggableControls type={key} key={key}>
                        <Horizontal>
                            <Vertical width={30}>
                                {Icons[key]}
                            </Vertical>
                            <Vertical>{ControlsNaming[key]}</Vertical>
                        </Horizontal>
                    </DraggableControls>
                })}
            </Vertical>
        </Vertical>
    </Panel>

}


function DraggableControls({type, ...props}) {
    const [isDragging, setIsDragging] = useState(false);
    const dropListener = useContext(DropListenerContext);

    const handleDragStart = (event) => {
        setIsDragging(true);
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', JSON.stringify({type}));
        dropListener.current = () => {
            setIsDragging(false);
        };
    }

    const handleDragEnd = () => {
        setIsDragging(false);
    }

    return <Vertical draggable={true}
                     onDragStart={handleDragStart}
                     onDragEnd={handleDragEnd}
                     opacity={isDragging ? 0.5 : 1}

                     {...props}>

        {props.children}
    </Vertical>
}