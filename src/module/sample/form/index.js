import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "../../../components/useForm";
import Input from "../../../components/input/Input";
import InputNumber from "components/input/InputNumber";
import Button from "components/button/Button";
import InputDate from "components/input/InputDate";
import InputTime from "components/input/InputTime";
import {isNullOrUndefined} from "components/utils";

const requiredValidator = (value) => {
    if (isNullOrUndefined(value)) {
        return 'Value required';
    }
    return '';
}

function Form() {
    const {control, handleSubmit} = useForm();
    return <Vertical p={2}>
        <form action="" onSubmit={handleSubmit(data => {
            debugger
        })}>
            <Vertical gap={2}>
                <Controller label={'One'} control={control} render={Input} name={"One"} validator={requiredValidator}/>
                <Controller label={'Two'} control={control} render={InputNumber} name={"Two"}
                            validator={requiredValidator}/>
                <Controller label={'Three'} control={control} render={InputDate} name={"Three"}
                            validator={requiredValidator}/>
                <Controller label={'Four'} control={control} render={InputTime} name={"Four"}
                            validator={requiredValidator}/>
                <Horizontal hAlign={'right'} pT={4}>
                    <Button type={'submit'} color={"primary"}>Save</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}

Form.title = 'Form'
export default Form;