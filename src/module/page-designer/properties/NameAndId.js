import {Horizontal, Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Input from "../../../components/input/Input";

function NameAndIdPanel({control}) {
    return <Vertical p={2} gap={2}>
        <Controller label={'Label'} horizontalLabelPositionWidth={35}
                    render={Input} name={'label'} flex={'1 0 auto'}
                    control={control}
                    autoCaps={false}
        />
        <Horizontal gap={5}>

            <Controller label={'Name'} horizontalLabelPositionWidth={35}
                        render={Input} name={'name'} flex={'1 0 auto'}
                        control={control}
                        casing={"camelCase"}
                        containerStyle={{width: '49%'}}
                        autoCaps={false}
            />
            <Controller label={'Key'} horizontalLabelPositionWidth={35} render={Input} name={'key'}
                        flex={'1 0 auto'} control={control}
                        containerStyle={{width: '49%'}}
                        autoCaps={false}
            />
        </Horizontal>
    </Vertical>
}

NameAndIdPanel.title = 'Name and Id';
export default NameAndIdPanel;