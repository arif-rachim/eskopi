import React, {Suspense} from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import useStateObserver, {ObserverValue, useObserverValue} from "components/useStateObserver";
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
    const [registerO, setRegister] = useStateObserver(false);
    const [signInR, getSignIn, isPendingO] = useResource();

    const register = useObserverValue(registerO);

    if (register) {
        return <RegistrationScreen/>
    }

    return <Vertical vAlign={'center'} hAlign={'center'} height={'100%'}>
        <form action="" onSubmit={handleSubmit(onSubmit(getSignIn))}>
            <Suspense fallback={<div>Loading ...</div>}>
                <ObserverValue observer={signInR}>
                    {signIn => {
                        const message = signIn.read();
                        return (<Vertical gap={2} width={200} b={1} p={4} r={5} brightness={0} color={"light"}>
                            <Horizontal>{JSON.stringify(message)}</Horizontal>
                            <Controller controller={controller} render={Input} name={"email"} label={'Email'}
                                        validator={requiredValidator('Email Required')}/>
                            <Controller controller={controller} render={Input} name={"password"} type={"password"}
                                        label={"Password"} validator={requiredValidator('Password Required')}/>
                            <Horizontal hAlign={'right'} mT={2} gap={2} vAlign={'center'}>
                                <Button type={"button"} color={"secondary"} mL={1}
                                        onClick={() => setRegister(true)}>Register</Button>
                                <Horizontal width={'100%'}/>
                                <ObserverValue observer={isPendingO}>
                                    {isPending => {
                                        if (isPending) {
                                            return <div>Loading ...</div>
                                        }
                                        return <Button type={"submit"} style={{whiteSpace: 'nowrap'}}>Log In</Button>
                                    }}
                                </ObserverValue>
                            </Horizontal>
                        </Vertical>)
                    }}
                </ObserverValue>
            </Suspense>
        </form>
    </Vertical>
}