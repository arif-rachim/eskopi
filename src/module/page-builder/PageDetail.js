import {Vertical} from "components/layout/Layout";

export default function PageDetail({closePanel}) {

    return <Vertical height={'100%'} width={'100%'} left={0} top={0} color={"light"} opacity={0.1} brightness={-2}
                     blur={1} position={"absolute"} hAlign={'center'}>
        <Vertical color={"primary"}>
            TEST BIJIKATEST
        </Vertical>
    </Vertical>
}