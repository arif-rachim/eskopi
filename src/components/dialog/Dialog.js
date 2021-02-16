import {Horizontal, Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import useLayers from "components/useLayers";
import {useEffect, useState} from "react";

const ANIMATION_DURATION = 300;
export default function Dialog({closePanel, message, buttons, color = 'light', alpha = 0.9}) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        requestAnimationFrame(() => setShow(true));
    }, []);
    return <Vertical height={'100%'} width={'100%'} top={0} position={'absolute'} vAlign={'center'} hAlign={'center'}
                     color={'dark'} alpha={show ? 0.5 : 0} blur={1}
                     transition={`all ${ANIMATION_DURATION}ms cubic-bezier(0,0,0.7,0.9)`}>
        <Vertical color={color} p={4} b={0} gap={5} r={2} brightness={0} alpha={alpha} opacity={show ? 1 : 0} blur={1}
                  elevation={show ? 3 : 0} transition={`all ${ANIMATION_DURATION}ms cubic-bezier(0,0,0.7,0.9)`}>
            <Horizontal style={{fontSize: 18}}>{message}</Horizontal>
            <Horizontal gap={2} hAlign={'right'}>
                {Object.keys(buttons).map(key => {
                    const color = buttons[key]?.color || 'light';
                    const onClick = () => {
                        setShow(false);
                        const cp = buttons[key]?.onClick || (() => closePanel(key));
                        setTimeout(() => cp(), ANIMATION_DURATION);

                    };
                    return <Button key={key} onClick={onClick} color={color}>{key}</Button>
                })}
            </Horizontal>
        </Vertical>
    </Vertical>
}

export function useConfirmCancelMessage() {
    const showPanel = useLayers();
    return async () => {
        const result = await showPanel(closePanel => <Dialog closePanel={closePanel}
                                                             message={'Are you sure you want to cancel changes ?'}
                                                             buttons={{
                                                                 YES: {color: 'primary'},
                                                                 NO: {color: 'light'}
                                                             }}/>);
        return result;
    }
}

export function useErrorMessage() {
    const showPanel = useLayers();
    return async (message) => {
        const result = await showPanel(closePanel => <Dialog closePanel={closePanel}
                                                             message={message}
                                                             color={'danger'}
                                                             alpha={0.8}
                                                             buttons={{OK: {color: 'light'}}}/>);
        return result;
    }
}

export function useInfoMessage() {
    const showPanel = useLayers();
    return async () => {
        const result = await showPanel(closePanel => <Dialog closePanel={closePanel}
                                                             message={'Changes updated successfully.'}
                                                             alpha={0.8}
                                                             buttons={{OK: {color: 'light'}}}/>);
        return result;
    }
}

export function useConfirmMessage() {
    const showPanel = useLayers();
    return async (message) => {
        const result = await showPanel(closePanel => <Dialog closePanel={closePanel}
                                                             message={message}
                                                             alpha={0.8}
                                                             buttons={{YES: {color: 'light'}, NO: {color: 'light'}}}/>);
        return result;
    }
}