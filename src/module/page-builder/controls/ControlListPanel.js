import useForm from "components/useForm";
import {Horizontal, Vertical} from "components/layout/Layout";
import {useContext, useState} from "react";
import {DropListenerContext} from "module/page-builder/index";
import Panel from "components/panel/Panel";

export default function ControlListPanel() {
    const {controller} = useForm({input: '', textArea: ''});
    return <Panel headerTitle={'Controls'}>
        <Vertical color={"light"} brightness={0.3}>
            <Vertical p={2} gap={3}>
                <DraggableControls type={Controls.SPACE}>
                    <Horizontal>
                        <Vertical width={30}>
                            <svg
                                height={16}
                                width={16}
                                viewBox="0 0 68.153976 68.153977">
                                <defs
                                    id="defs2">
                                    <clipPath
                                        id="clip0">
                                        <rect
                                            x="581"
                                            y="204"
                                            width="343"
                                            height="340"
                                            id="rect833"/>
                                    </clipPath>
                                </defs>
                                <g
                                    transform="translate(-101.31109,-145.6641)">
                                    <path
                                        id="rect875"
                                        style={{
                                            fill: '#000000',
                                            fillOpacity: 1,
                                            stroke: 'none',
                                            strokeWidth: 30.2362,
                                            strokeMiterlimit: 4,
                                            strokeDasharray: 'none',
                                            strokeOpacity: 1
                                        }}
                                        d="M 41.416016,36.365234 V 293.95508 H 145.9668 V 237.89062 H 97.480469 V 92.429688 H 145.9668 V 36.365234 Z m 153.039064,0 v 56.064454 h 48.48633 V 237.89062 h -48.48633 v 56.06446 H 299.00586 V 36.365234 Z"
                                        transform="matrix(0.26458333,0,0,0.26458333,90.353101,136.04247)"/>
                                </g>
                            </svg>

                        </Vertical>
                        <Vertical>Group</Vertical>
                    </Horizontal>
                </DraggableControls>
                <DraggableControls type={Controls.LABEL}>
                    <Horizontal vAlign={'center'} gap={1}>
                        <Vertical width={25}>
                            <svg
                                width={16} height={16}
                                viewBox="0 0 89.958328 88.635422">
                                <g
                                    transform="translate(-90.353101,-136.04247)">
                                    <path
                                        id="path838"
                                        style={{strokeWidth: '0.264583'}}
                                        d="m 135.33227,136.04247 -44.979169,88.63542 h 13.303069 l 11.63494,-22.88956 h 40.61148 l 11.63495,22.88956 h 12.77389 z m 0.26458,25.79688 14.19241,27.92181 h -28.38483 z"/>
                                </g>
                            </svg>

                        </Vertical>
                        <Vertical>Label</Vertical>
                    </Horizontal>
                </DraggableControls>
                <DraggableControls type={Controls.TEXT_INPUT}>
                    <Horizontal vAlign={'center'} gap={1}>
                        <Vertical width={25}>
                            <svg viewBox={'0 0 355 355'} width="16" height="16"
                                 overflow="hidden">
                                <g transform="translate(-136 -104)">
                                    <rect x="145" y="112" width="337" height="338" stroke="#000000" stroke-width="16"
                                          stroke-miterlimit="8" fill="none"/>
                                    <path d="M239.5 151.5 239.5 410.825" stroke="#000000" stroke-width="21.3333"
                                          stroke-miterlimit="8" fill="none" fill-rule="evenodd"/>
                                </g>
                            </svg>
                        </Vertical>
                        <Vertical pB={1}>
                            Input
                        </Vertical>
                    </Horizontal>
                </DraggableControls>
                <DraggableControls type={Controls.TEXT_AREA}>
                    <Horizontal vAlign={'center'} gap={1}>
                        <Vertical width={25}>
                            <svg viewBox={'0 0 565 564'} width="22" height="22" xmlns="http://www.w3.org/2000/svg"
                                 overflow="hidden">
                                <g transform="translate(-136 -104)">
                                    <rect x="145" y="112" width="547" height="548" stroke="#000000" stroke-width="16"
                                          stroke-miterlimit="8" fill="none"/>
                                    <path d="M239.5 151.5 239.5 410.825" stroke="#000000" stroke-width="21.3333"
                                          stroke-miterlimit="8" fill="none" fill-rule="evenodd"/>
                                </g>
                            </svg>

                        </Vertical>
                        <Vertical pB={1}>
                            Text Area
                        </Vertical>
                    </Horizontal>

                </DraggableControls>
                <DraggableControls type={Controls.BUTTON}>
                    <Horizontal vAlign={'center'} gap={1}>
                        <Vertical width={25}>
                            <svg viewBox={'0 0 377 376'} width="16" height="16" xmlns="http://www.w3.org/2000/svg"
                                 overflow="hidden">
                                <defs>
                                    <linearGradient x1="324.5" y1="112" x2="324.5" y2="472"
                                                    gradientUnits="userSpaceOnUse" spreadMethod="reflect" id="fill1">
                                        <stop offset="0" stop-color="#F6F8FC"/>
                                        <stop offset="0.18" stop-color="#A6A6A6"/>
                                        <stop offset="0.83" stop-color="#A6A6A6"/>
                                        <stop offset="1" stop-color="#D9D9D9"/>
                                    </linearGradient>
                                </defs>
                                <g transform="translate(-136 -104)">
                                    <rect x="145" y="112" width="359" height="360" stroke="#000000" stroke-width="16"
                                          stroke-miterlimit="8" fill="url(#fill1)"/>
                                </g>
                            </svg>
                        </Vertical>
                        <Vertical pB={1}>
                            Button
                        </Vertical>
                    </Horizontal>

                </DraggableControls>
            </Vertical>
        </Vertical>
    </Panel>

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

                     {...props}>

        {props.children}
    </Vertical>
}