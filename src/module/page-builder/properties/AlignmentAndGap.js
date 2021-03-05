import {Horizontal} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Input from "components/input/Input";

export function AlignmentAndGap({controller}) {
    return <Horizontal gap={5} p={2}>
        <Controller label={'Vertical'} horizontalLabelPositionWidth={40} render={Input} name={'width'} flex={'1 0 auto'}
                    controller={controller}/>
        <Controller label={'Horizontal'} horizontalLabelPositionWidth={40} render={Input} name={'height'}
                    flex={'1 0 auto'} controller={controller}/>
    </Horizontal>
}