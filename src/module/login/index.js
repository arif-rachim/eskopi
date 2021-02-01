import React from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import Button from "components/button/Button";
import {useAuth} from "reactfire";
import useObserver, {useObserverValue} from "components/useObserver";
import Label from "components/label/Label";
import RegistrationScreen from "module/registration";
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
function onSubmit(auth,controller,setError) {
    return async (data) => {
        try{
            await auth.setPersistence('local');
            const user = await auth.signInWithEmailAndPassword(data.email, data.password);
        }catch(err){
            switch(err.code){
                case 'auth/wrong-password' : {
                    controller.current.setErrors('password','Wrong password');
                    break;
                }
                case 'auth/invalid-email' : {
                    controller.current.setErrors('email','Email address invalid');
                    break;
                }
                case 'auth/too-many-requests' : {
                    setError('Too many attempt');
                    break;
                }
                default : {
                    console.log(err);
                }
            }
        }
    }
}

export default function LoginScreen() {
    const {controller, handleSubmit} = useForm({userName: '', password: ''});
    const [$error,setError] = useObserver();
    const [$register,setRegister] = useObserver(false);
    const register = useObserverValue($register);
    const auth = useAuth();

    if(register){
        return <RegistrationScreen/>
    }
    return <Vertical vAlign={'center'} hAlign={'center'} height={'100%'}>
        <Label observer={$error} />
        <form action="" onSubmit={handleSubmit(onSubmit(auth,controller,setError))}>
            <Vertical gap={2} width={200} b={1} p={4} r={5} brightness={0} color={"light"}>
                <Controller controller={controller} render={Input} name={"email"} label={'Email'}
                            validator={requiredValidator('Email Required')}/>
                <Controller controller={controller} render={Input} name={"password"} type={"password"}
                            label={"Password"} validator={requiredValidator('Password Required')}/>
                <Horizontal hAlign={'right'} mT={2} gap={2} vAlign={'center'}>
                    <Button type={"button"} color={"secondary"}  mL={1} onClick={() => setRegister(true)}>Register</Button>
                    <Horizontal width={'100%'}/>
                    <Button type={"submit"} style={{whiteSpace: 'nowrap'}}>Log In</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}