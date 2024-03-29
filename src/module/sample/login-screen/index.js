import {Horizontal, Vertical} from "components/layout/Layout";
import Input from "../../../components/input/Input";
import useForm, {Controller} from "../../../components/useForm";
import Button from "../../../components/button/Button";
import React from "react";

const valueRequired = errorMessage => value => value && value.length > 0 ? '' : errorMessage;

export default function LoginScreen() {
    const {control, handleSubmit} = useForm({
        userName: 'Arif',
        password: 'achim'
    });
    return <Vertical color={"light"} height={'100%'} hAlign={'center'} vAlign={'center'}>
        <form action="" onSubmit={handleSubmit((data) => {
        })}>
            <Vertical gap={3} color={"light"} brightness={-0.5} p={5} pT={7} r={5} b={0.5} width={200}>
                <Controller validateOn={'change'} label={"User Name"} control={control} render={Input}
                            name={'userName'} validator={valueRequired('Name is required')}/>
                <Controller label={"Password"} control={control} render={Input} type={'password'}
                            name={'password'} validator={valueRequired('Password is required')}/>
                <Horizontal>
                    {JSON.stringify(control.errors)}
                </Horizontal>
                <Horizontal hAlign={'right'}>
                    <Button type={'submit'}>Log In</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}