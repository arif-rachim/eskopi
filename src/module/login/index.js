import React from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import useResource, {useResourceValue} from "components/useResource";
import RegistrationScreen from "module/registration";
import Input from "components/input/Input";
import Button from "components/button/Button";
import useLayers from "components/useLayers";
import Dialog from "components/dialog/Dialog";
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
function onSubmit(getSignIn) {
    return (data) => {
        getSignIn('/authentication/sign-in', {email: data.email, password: data.password});
    }
}

export default function LoginScreen() {
    const {controller, handleSubmit} = useForm({email: '', password: ''});
    const [$signIn, getSignIn, $isPending] = useResource();
    const showPanel = useLayers();
    const [, setUser] = useUser();
    useResourceValue($signIn, (status, result) => {
        if (status === 'success') {
            setUser(result);
        }
        if (status === 'error') {
            showPanel(closePanel => <Dialog closePanel={closePanel} message={result.message}
                                            buttons={{OK: {color: 'primary'}}}/>).then()
        }
    });
    const background = useGradient(-1).stop(0, 'light', 0, 1).stop(1, 'light', -1, 1).toString();
    return <Vertical vAlign={'center'} hAlign={'center'} height={'100%'} background={background}>
        <form action="" onSubmit={handleSubmit(onSubmit(getSignIn))}>
            <Vertical gap={2} width={200} b={1} p={4} r={5} elevation={1}>
                <Controller controller={controller} render={Input} name={"email"} label={'Email'}
                            validator={requiredValidator('Email Required')} disabled={$isPending}/>
                <Controller controller={controller} render={Input} name={"password"} type={"password"}
                            label={"Password"} validator={requiredValidator('Password Required')}
                            disabled={$isPending}/>
                <Horizontal hAlign={'right'} mT={2} gap={2} vAlign={'center'}>
                    <Button type={"button"} color={"secondary"} mL={1}
                            onClick={async () => {
                                const email = await showPanel(closePanel => <RegistrationScreen onClose={closePanel}/>)
                                controller.current.setValue('email', email);
                            }} disabled={$isPending}>Register</Button>
                    <Horizontal width={'100%'}/>
                    <Button type={"submit"} style={{whiteSpace: 'nowrap'}} disabled={$isPending}>Log In</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}