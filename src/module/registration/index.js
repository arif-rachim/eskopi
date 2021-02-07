import React, {useEffect} from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import Button from "components/button/Button";
import useResource from "components/useResource";
import {useObserverValue} from "components/useStateObserver"

/**
 * Validator with error message
 * @param {string} errorMessage
 * @returns {function(*=): *|string}
 */
function requiredValidator(errorMessage) {
    return function (value, formValue) {
        return value === null || value === undefined || value === '' ? errorMessage : '';
    };
}

/**
 * On form submitted
 */
function onSubmit(getRegistrationResource) {
    return (data) => {
        getRegistrationResource('/authentication/register', {
            name: data.name,
            email: data.email,
            password: data.password
        });
    }
}

export default function RegistrationScreen() {
    const {controller, handleSubmit, reset} = useForm({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    });
    const [registrationResource, getRegistrationResource, isPendingO] = useResource();


    return <Vertical vAlign={'center'} hAlign={'center'} height={'100%'}>

        <form action="" onSubmit={handleSubmit(onSubmit(getRegistrationResource))}>
            <Vertical gap={2} b={1} p={4} r={5} brightness={0} color={"light"}>
                <Controller controller={controller} render={Input} name={"name"} label={'Name'}
                            validator={requiredValidator('Name required')} disabled={isPendingO}/>
                <Controller controller={controller} render={Input} name={"email"} label={'Email'}
                            validator={requiredValidator('Email Required')} autoCaps={false}/>

                <Horizontal gap={5} overflow={'visible'}>
                    <Controller controller={controller} render={Input} name={"password"} type={"password"}
                                label={"Password"} validator={requiredValidator('Password Required')}/>
                    <Controller controller={controller} render={Input} name={"passwordConfirmation"} type={"password"}
                                label={"Confirm Password"}
                                validator={(value, formValue) => {
                                    if (value) {
                                        if (value !== formValue.password) {
                                            return 'Value not match'
                                        }
                                        return '';
                                    }
                                    return 'Value required';
                                }}/>
                </Horizontal>
                <Horizontal hAlign={'right'} mT={2} gap={5} vAlign={'center'}>
                    <Horizontal width={'100%'}/>
                    <Button type={"submit"} style={{whiteSpace: 'nowrap'}}>Register</Button>
                    <Button type={"reset"} style={{whiteSpace: 'nowrap'}} color={"light"} onClick={reset}>Reset</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}