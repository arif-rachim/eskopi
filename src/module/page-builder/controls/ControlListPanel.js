import useForm, {Controller} from "components/useForm";
import {Horizontal, Vertical} from "components/layout/Layout";
import Input from "components/input/Input";
import TextArea from "components/input/TextArea";
import Button from "components/button/Button";
import {useContext, useState} from "react";
import {DropListenerContext} from "module/page-builder/index";

export default function ControlListPanel() {
    const {controller} = useForm({input: '', textArea: ''});
    return <Vertical flex={1} color={'light'} brightness={0.1} bB={3}>
        <Horizontal color={"light"} brightness={-2} bB={3} p={1} vAlign={'center'}>
            Controls
        </Horizontal>
        <Vertical color={"light"} brightness={0.3}>
            <Vertical p={2} gap={3}>
                <DraggableControls type={Controls.SPACE}>
                    <Horizontal height={30} flex={1} gap={3}>
                        <Horizontal b={3} flex={1}/>
                        <Horizontal b={3} flex={1}/>
                        <Horizontal b={3} flex={1}/>
                        <Horizontal b={3} flex={1}/>
                    </Horizontal>
                </DraggableControls>
                <DraggableControls type={Controls.LABEL}>
                    <Vertical>Label</Vertical>
                </DraggableControls>
                <DraggableControls type={Controls.TEXT_INPUT}>
                    <Controller render={Input} type={"input"} label={"Input"} controller={controller} name={"input"}
                                disabled={true}/>
                </DraggableControls>
                <DraggableControls hAlign={'center'} type={Controls.TEXT_AREA}>
                    <Controller render={TextArea} rows={3} label={"Text Area"} controller={controller}
                                name={"textarea"} disabled={true}/>
                </DraggableControls>
                <DraggableControls hAlign={'center'} type={Controls.BUTTON}>
                    <Button color={"primary"}>Button</Button>
                </DraggableControls>
            </Vertical>
        </Vertical>
    </Vertical>
}

export const Controls = {
    TEXT_INPUT: 'textInput',
    TEXT_AREA: 'textArea',
    BUTTON: 'button',
    SPACE: 'space',
    LABEL: 'label'
};

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
                     p={2}
                     style={{fontSize: 18}} b={1}  {...props}>

        {props.children}
    </Vertical>
}