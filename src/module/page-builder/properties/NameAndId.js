import {Horizontal, Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Input from "../../../components/input/Input";

function NameAndIdPanel({control}) {
    return <Vertical>
        <Horizontal gap={5} p={2}>
            <Controller label={'Name'} horizontalLabelPositionWidth={35}
                        render={Input} name={'name'} flex={'1 0 auto'}
                        control={control}
                        containerStyle={{width: '50%'}}
                        autoCaps={false}
            />
            <Controller label={'Key'} horizontalLabelPositionWidth={35} render={Input} name={'key'}
                        flex={'1 0 auto'} control={control}
                        containerStyle={{width: '50%'}}
                        autoCaps={false}
            />
        </Horizontal>
    </Vertical>
}

NameAndIdPanel.title = 'Name and Id';
export default NameAndIdPanel;