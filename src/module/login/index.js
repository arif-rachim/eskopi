import React from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import useResource, {useResourceListener} from "components/useResource";
import RegistrationScreen from "module/login/registration";
import Input from "components/input/Input";
import Button from "components/button/Button";
import useLayers from "components/useLayers";
import {useErrorMessage} from "components/dialog/Dialog";
import useGradient from "components/useGradient";
import useUser from "components/authentication/useUser";

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
function onSubmit(setSignInResource) {
    return (data) => {
        setSignInResource('/authentication/sign-in', {email: data.email, password: data.password});
    }
}

export default function LoginScreen() {
    const {control, handleSubmit} = useForm({email: '', password: ''});
    const [$signInResource, setSignInResource, $isPending] = useResource();
    const showPanel = useLayers();
    const [, setUser] = useUser();
    const errorMessage = useErrorMessage();
    useResourceListener($signInResource, (status, result) => {
        if (status === 'success') {
            setUser(result);
        }
        if (status === 'error') {
            (async () => {
                await errorMessage(result.message);
            })();
        }
    });

    const background = useGradient(-1).stop(0, 'light', 0, 1).stop(1, 'light', -1, 1).toString();
    return <Vertical vAlign={'center'} hAlign={'center'} height={'100%'} background={background}>
        <form action="" onSubmit={handleSubmit(onSubmit(setSignInResource))}>
            <Vertical gap={2} width={200} b={1} p={4} r={5} elevation={1}>
                <Controller control={control} render={Input} name={"email"} label={'Email'}
                            validator={requiredValidator('Email Required')} $disabled={$isPending}/>
                <Controller control={control} render={Input} name={"password"} type={"password"}
                            label={"Password"} validator={requiredValidator('Password Required')}
                            $disabled={$isPending}/>
                <Horizontal hAlign={'right'} mT={2} gap={2} vAlign={'center'}>
                    <Button type={"button"} color={"secondary"} mL={1}
                            onClick={async () => {
                                const email = await showPanel(closePanel => <RegistrationScreen onClose={closePanel}/>)
                                control.current.onChange.email(email);
                            }} $disabled={$isPending}>Register</Button>
                    <Horizontal flex={'1 0 auto'}/>
                    <Button type={"submit"} style={{whiteSpace: 'nowrap'}} $disabled={$isPending}>Log In</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}