import {Horizontal, Vertical} from "../../components/layout/Layout";
import useObserver from "components/useObserver";
import React from "react";
import PageTree from "module/page-builder/PageTree";
import Input from "components/input/Input";
import useForm, {Controller} from "components/useForm";
import TextArea from "components/input/TextArea";
import Button from "components/button/Button";

export default function PageBuilder() {
    const [$selectedPage, setSelectedPage] = useObserver();

    return <Vertical height={'100%'}>
        <Horizontal height={'100%'}>
            <Vertical height={'100%'} width={200} color={"light"} bR={4}>
                <PageTree $selectedPage={$selectedPage} setSelectedPage={setSelectedPage}/>
                <ControlsComponent/>
            </Vertical>
            <Vertical flex={1}>
                <PageEditor $page={$selectedPage}/>
            </Vertical>
            <Vertical width={200} color={"light"} brightness={-3}></Vertical>
        </Horizontal>
    </Vertical>
}

PageBuilder.title = 'Page Builder';

function PageEditor() {
    return <Vertical color={"light"} brightness={-3} p={3} flex={1}>

        <Vertical color={"light"} brightness={0} flex={1} elevation={1}>

        </Vertical>
    </Vertical>
}

function ControlsComponent() {
    const {controller} = useForm({input: '', textArea: ''});
    return <Vertical flex={1} color={'light'} brightness={0.1} bB={3}>
        <Horizontal color={"light"} brightness={-2} bB={3} p={1} vAlign={'center'}>
            Controls
        </Horizontal>
        <Vertical color={"light"} brightness={0.3}>
            <Vertical p={2} gap={3}>
                <DraggableControls type={Controls.HORIZONTAL}>
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
                <DraggableControls type={Controls.TEXT}>
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
    TEXT: 'text',
    TEXT_AREA: 'textArea',
    BUTTON: 'button',
    HORIZONTAL: 'horizontal',
    LABEL: 'label'
};

function DraggableControls({type, ...props}) {
    return <Vertical draggable={true} p={2} style={{fontSize: 18}} b={1}  {...props}>
        {props.children}
    </Vertical>
}
