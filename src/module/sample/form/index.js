import {Vertical} from "../../../components/layout/Layout";
import useForm, {Controller} from "../../../components/useForm";
import Input from "../../../components/input/Input";
import {useObserverListener} from "../../../components/useObserver";

export default function Form() {
    const {controller, handleSubmit, $value} = useForm();
    useObserverListener($value, value => {
        console.log(value);
    })
    return <Vertical>
        <form action="" onSubmit={handleSubmit(data => {
            debugger
        })}>
            <Controller controller={controller} render={Input} name={"one"}/>
        </form>
    </Vertical>
}