import React from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import Button from "components/button/Button";
import {useAuth} from "reactfire";


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
function onSubmit(auth, controller) {
    return (data) => {
        auth.createUserWithEmailAndPassword(data.email, data.password).then((userCredential) => {
            // do nothing

        }).catch((error) => {
            switch (error.code) {
                case 'auth/weak-password' : {
                    controller.current.setErrors('password', 'Weak password');
                    break;
                }
                case 'auth/operation-not-allowed' : {
                    controller.current.setErrors('name', 'Operation not allowed');
                    break;
                }
                case 'auth/invalid-email' : {
                    controller.current.setErrors('email', 'Invalid email');
                    break;
                }
                case 'auth/email-already-in-use' : {
                    controller.current.setErrors('email', 'Email already in use');
                    break;
                }
                default : {

                }
            }

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
    const auth = useAuth();

    return <Vertical vAlign={'center'} hAlign={'center'} height={'100%'}>

        <form action="" onSubmit={handleSubmit(onSubmit(auth, controller))}>
            <Vertical gap={2} b={1} p={4} r={5} brightness={0} color={"light"}>
                <Controller controller={controller} render={Input} name={"name"} label={'Name'}
                            validator={requiredValidator('Name required')}/>
                <Controller controller={controller} render={Input} name={"email"} label={'Email'}
                            validator={requiredValidator('Email Required')}/>

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