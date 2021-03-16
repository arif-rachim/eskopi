import {Vertical} from "../../../components/layout/Layout";
import useForm, {Controller} from "../../../components/useForm";
import Input from "../../../components/input/Input";
import {useObserverListener} from "../../../components/useObserver";
import InputNumber from "components/input/InputNumber";
import Button from "components/button/Button";
import InputDate from "components/input/InputDate";
import InputTime from "components/input/InputTime";

export default function Form() {
    const {control, handleSubmit, $value} = useForm();
    useObserverListener($value, value => {
        console.log(value);
    })
    return <Vertical>
        <form action="" onSubmit={handleSubmit(data => {
            debugger
        })}>
            <Controller label={'One'} control={control} render={Input} name={"One"}/>
            <Controller label={'Two'} control={control} render={InputNumber} name={"Two"}/>
            <Controller label={'Three'} control={control} render={InputDate} name={"Three"}/>
            <Controller label={'Four'} control={control} render={InputTime} name={"Four"}/>
            <Button type={'submit'}>Save</Button>
        </form>
    </Vertical>
}