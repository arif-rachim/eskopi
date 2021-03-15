import {Vertical} from "../../../components/layout/Layout";
import useForm, {Controller} from "../../../components/useForm";
import Input from "../../../components/input/Input";
import {useObserverListener} from "../../../components/useObserver";
import InputNumber from "components/input/InputNumber";
import Button from "components/button/Button";

export default function Form() {
    const {controller, handleSubmit, $value} = useForm();
    useObserverListener($value, value => {
        console.log(value);
    })
    return <Vertical>
        <form action="" onSubmit={handleSubmit(data => {
            debugger
        })}>
            <Controller label={'One'} controller={controller} render={Input} name={"One"}/>
            <Controller label={'Two'} controller={controller} render={InputNumber} name={"Two"}/>
            <Button type={'submit'}>Save</Button>
        </form>
    </Vertical>
}