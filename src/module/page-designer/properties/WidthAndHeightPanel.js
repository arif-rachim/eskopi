import {Horizontal} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Input from "components/input/Input";

function WidthAndHeightPanel({control}) {
    return <Horizontal gap={5} p={2}>
        <Controller label={'Width'} horizontalLabelPositionWidth={40} render={Input} name={'width'} flex={'1 0 auto'}
                    control={control} containerStyle={{width: '49%'}}/>
        <Controller label={'Height'} horizontalLabelPositionWidth={40} render={Input} name={'height'} flex={'1 0 auto'}
                    control={control} containerStyle={{width: '49%'}}/>
    </Horizontal>
}

WidthAndHeightPanel.title = 'Width and Height';
export default WidthAndHeightPanel;