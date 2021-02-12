import {Horizontal, Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import useLayers from "components/useLayers";

export default function Dialog({closePanel, message, buttons, color = 'light', opacity = 0.9}) {
    return <Vertical height={'100%'} width={'100%'} top={0} position={'absolute'} vAlign={'center'} hAlign={'center'}
                     color={'dark'} opacity={0.5} blur={1}>
        <Vertical color={color} p={4} b={1} gap={5} r={2} brightness={0} opacity={opacity} blur={1} elevation={1}>
            <Horizontal style={{fontSize: 18}}>{message}</Horizontal>
            <Horizontal gap={2} hAlign={'right'}>
                {Object.keys(buttons).map(key => {
                    const color = buttons[key]?.color || 'light';
                    const onClick = buttons[key]?.onClick || (() => closePanel(key));
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
                                                             opacity={0.8}
                                                             buttons={{OK: {color: 'light'}}}/>);
        return result;
    }
}

export function useInfoMessage() {
    const showPanel = useLayers();
    return async () => {
        const result = await showPanel(closePanel => <Dialog closePanel={closePanel}
                                                             message={'Changes updated successfully.'}
                                                             opacity={0.8}
                                                             buttons={{OK: {color: 'light'}}}/>);
        return result;
    }
}

export function useConfirmMessage() {
    const showPanel = useLayers();
    return async (message) => {
        const result = await showPanel(closePanel => <Dialog closePanel={closePanel}
                                                             message={message}
                                                             opacity={0.8}
                                                             buttons={{YES: {color: 'light'}, NO: {color: 'light'}}}/>);
        return result;
    }
}