import {MHorizontal as Horizontal,MVertical as Vertical} from "components/layout/Layout";
import Input from "../../../components/input/Input";
import useForm from "../../../components/useForm";
import Button from "../../../components/button/Button";
import Label from "../../../components/label/Label";

export default function LoginScreen() {
    const {errors, handleSubmit, register} = useForm();

    return <Vertical color={"light"} height={'100%'} hAlign={'center'} vAlign={'center'} >
        <form action="" onSubmit={handleSubmit((data) => {
            debugger;
        })}>
            <Vertical gap={3} color={"light"} brightness={-0.5} p={5} pT={7} r={5} b={0.5}>
                <Label label={'User Name'} >
                    <Input autoCaps inputRef={register((value) => value && value.length > 0 ? '' : 'Hey your input invalid')}
                           name={'userName'} placeholder={'User Name'} errorMessage={errors.userName}/>
                </Label>

                <Input inputRef={register((value) => value && value.length > 0 ? '' : 'Hey your password invalid')}
                       name={'password'} type={'password'} placeholder={'Password'} required/>
                <Horizontal>
                    {JSON.stringify(errors)}
                </Horizontal>
                <Horizontal hAlign={'right'}>
                    <Button type={'submit'}>Log In</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}