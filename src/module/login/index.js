import React from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import useObserver, {useObserverValue} from "components/useObserver";
import {useResourceValue} from "components/useResource";
import RegistrationScreen from "module/registration";
import useResource from "components/useResource";
import Input from "components/input/Input";
import Button from "components/button/Button";

/**
 * Validator with error message
 * @param {string} errorMessage
 * @returns {function(*=): *|string}
 */
function requiredValidator(errorMessage) {
    return function (value) {
        return value === null || value === undefined || value === '' ? errorMessage : '';
    };
}

/**
 * On form submitted
 */
function onSubmit(getSignIn) {
    return (data) => {
        getSignIn('/authentication/sign-in', {email: data.email, password: data.password});
    }
}

export default function LoginScreen() {
    const {controller, handleSubmit} = useForm({email: '', password: ''});
    const [$register, setRegister] = useObserver(false);
    const [$signIn, getSignIn, $isPending] = useResource();

    useResourceValue($signIn,(status,value) => {
        console.log('status',status,'value',value);
    });

    const register = useObserverValue($register);

    if (register) {
        return <RegistrationScreen/>
    }

    return <Vertical vAlign={'center'} hAlign={'center'} height={'100%'}>
        <form action="" onSubmit={handleSubmit(onSubmit(getSignIn))}>
            <Vertical gap={2} width={200} b={1} p={4} r={5} brightness={0} color={"light"}>
                <Controller controller={controller} render={Input} name={"email"} label={'Email'}
                            validator={requiredValidator('Email Required')} disabled={$isPending}/>
                <Controller controller={controller} render={Input} name={"password"} type={"password"}
                            label={"Password"} validator={requiredValidator('Password Required')}
                            disabled={$isPending}/>
                <Horizontal hAlign={'right'} mT={2} gap={2} vAlign={'center'}>
                    <Button type={"button"} color={"secondary"} mL={1}
                            onClick={() => setRegister(true)} disabled={$isPending}>Register</Button>
                    <Horizontal width={'100%'}/>
                    <Button type={"submit"} style={{whiteSpace: 'nowrap'}} disabled={$isPending}>Log In</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}