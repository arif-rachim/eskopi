import {Horizontal,Vertical} from "components/layout/Layout";
import Input from "../../../components/input/Input";
import useForm, {Controller} from "../../../components/useForm";
import Button from "../../../components/button/Button";

const valueRequired = errorMessage => value => value && value.length > 0 ? '' : errorMessage;

export default function LoginScreen() {
    const {controller, handleSubmit} = useForm();
    console.log(controller);
    return <Vertical color={"light"} height={'100%'} hAlign={'center'} vAlign={'center'} >
        <form action="" onSubmit={handleSubmit((data) => {
            debugger;
        })}>
            <Vertical gap={3} color={"light"} brightness={-0.5} p={5} pT={7} r={5} b={0.5}>
                <Controller defaultValue={'Arif'} label={"User Name"} controller={controller} render={Input} name={'userName'} validator={valueRequired('Name is required')}/>
                <Controller defaultValue={'Password'} label={"Password"} controller={controller} render={Input} type={'password'} name={'password'} validator={valueRequired('Password is required')}/>
                <Horizontal>
                    {JSON.stringify(controller.errors)}
                </Horizontal>
                <Horizontal hAlign={'right'}>
                    <Button type={'submit'}>Log In</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}