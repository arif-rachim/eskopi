import React, {useCallback, useRef, useState} from "react";
import useObserver from "./useObserver";

/**
 * Create onSubmit handler
 * @param controller
 * @returns {function(*=): function(*): void}
 */
const handleSubmitFactory = (controller) => (callback) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    callback.apply(callback, [controller.current.value, controller.current.errors]);
}

/**
 * Create register method
 * @param controller
 * @param setErrors
 * @returns {function(*=): function(*): void}
 */
const registerFactory = (controller) => (validator) => {
    const propsRef = useRef({});
    propsRef.current.validator = validator;
    propsRef.current.controller = controller;
    return useCallback((input) => {
        if (!input) {
            return;
        }
        propsRef.current.name = input.getAttribute('name');
        const onBlur = callbackOnBlur(propsRef);
        const onChange = callbackOnChange(propsRef,() => {});
        input.addEventListener('input', (event) => {
            onChange(event.target.value);
        });
        input.addEventListener('blur', onBlur);
    }, []);
}

/**
 * useForm function
 * @returns {{handleSubmit: (function(*=): function(*): void), controller: React.MutableRefObject<{errorsObserver: *, valueObserver: *, defaultValue: {}, setValue: *, userEditingField: {}, modified: {}, setErrors: *, value: {}, previousValue: {}, errors: {}}>, register: (function(*=): function(*): void)}}
 */
export default function useForm() {
    const [errorsObserver, setErrors] = useObserver({});
    const [valueObserver, setValue] = useObserver({});
    const controller = useRef({
        defaultValue: {},
        value: {},
        userEditingField: {},
        previousValue: {},
        modified: {},
        errors:{},
        valueObserver,
        setValue,
        errorsObserver,
        setErrors,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSubmit = useCallback(handleSubmitFactory(controller), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const register = useCallback(registerFactory(controller), []);

    return {
        handleSubmit,
        register,
        controller
    }
}

const callbackOnBlur = (propsRef) => () => {
    const {controller, name, validator} = propsRef.current;
    if (controller.current.userEditingField[name]) {
        const oldValue = controller.current.previousValue[name];
        const newValue = controller.current.value[name];
        const oldError = controller.current.errors[name];
        let newError = '';
        if (validator) {
            newError = validator.apply(validator, [newValue]);
        }
        if(oldValue !== newValue){
            controller.current.setValue(name,newValue);
        }
        if(oldError !== newError){
            controller.current.errors[name] = newError;
            controller.current.setErrors(name,newError);
        }
        controller.current.previousValue[name] = controller.current.value[name];
        controller.current.userEditingField[name] = false;
    }
};


const callbackOnChange = (propsRef, setRerender) => (value) => {
    const {controller, name} = propsRef.current;
    controller.current.userEditingField[name] = true;
    controller.current.value[name] = value;
    controller.current.modified[name] = true;
    setRerender(Math.random() * 100000);
};


export function Controller({name, defaultValue, validator, render, controller, ...props}) {
    const [, setRerender] = useState();
    controller.current.defaultValue[name] = defaultValue;
    const propsRef = useRef({controller, name, validator});
    propsRef.current = {controller, name, validator};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onBlur = useCallback(callbackOnBlur(propsRef), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChange = useCallback(callbackOnChange(propsRef, setRerender), []);
    const value = controller.current.modified[name] ? controller.current.value[name] : defaultValue;
    return <>
        <input type={'hidden'}/>
        {render.apply(this, [{...props, name, onBlur, onChange, value}])}
    </>;
}

