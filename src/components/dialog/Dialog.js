import {Horizontal, Vertical} from "components/layout/Layout";
import Button from "components/button/Button";

export default function Dialog({closePanel}) {
    return <Vertical height={'100%'} width={'100%'} top={0} position={'absolute'} vAlign={'center'} hAlign={'center'}
                     color={'dark'} opacity={0.5} blur={1}>
        <Vertical color={'light'} p={4} b={1} gap={5} r={2} brightness={0.9} opacity={1} blur={1} elevation={3}>
            <Horizontal style={{fontSize: 18}}>Are you sure you want to continue ?</Horizontal>
            <Horizontal gap={2} hAlign={'right'}>
                <Button onClick={() => closePanel()}>Yes</Button>
                <Button onClick={() => closePanel()}>No</Button>
            </Horizontal>
        </Vertical>
    </Vertical>
}