import React, {useCallback, useRef, useState} from "react";

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
 * Create watch method
 * @param controller
 * @returns {function(*, *=): function(): void}
 */
const watchFactory = (controller) => (name, onChange) => {
    controller.current.watchers[name] = controller.current.watchers[name] || [];
    controller.current.watchers[name].push(onChange);
    return () => {
        controller.current.watchers[name].splice(controller.current.watchers[name].indexOf(onChange), 1);
    }
};

/**
 * useForm function
 * @returns {{handleSubmit: (function(*=): function(*): void), controller: React.MutableRefObject<{defaultValue: {}, elements: {}, userEditingField: {}, watchers: {}, modified: {}, setErrors: (value: (((prevState: {}) => {}) | {})) => void, value: {}, previousValue: {}, errors: {}}>, watch: (function(*, *=): function(): void), errors: {}, register: (function(*=): function(*): void)}}
 */
export default function useForm() {
    const [errors, setErrors] = useState({});
    const controller = useRef({
        defaultValue: {},
        value: {},
        errors: {},
        watchers: {},
        userEditingField: {},
        previousValue: {},
        modified: {},
        setErrors
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSubmit = useCallback(handleSubmitFactory(controller), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const register = useCallback(registerFactory(controller), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const watch = useCallback(watchFactory(controller), []);

    return {
        handleSubmit,
        register,
        watch,
        errors,
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

        if (newError && newError.length > 0) {
            controller.current.errors[name] = newError;
        } else if (oldError) {
            delete controller.current.errors[name];
        }
        if (controller.current.watchers[name]) {
            controller.current.watchers[name].forEach((watcher) => {
                watcher.apply(watcher, [newValue, oldValue, newError]);
            });
        }
        if (oldError !== newError) {
            controller.current.setErrors({...controller.current.errors});
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
    const onBlur = useCallback(callbackOnBlur(propsRef), []);
    const onChange = useCallback(callbackOnChange(propsRef, setRerender), []);
    const value = controller.current.modified[name] ? controller.current.value[name] : defaultValue;
    return <>
        <input type={'hidden'}/>
        {render.apply(this, [{...props, name, onBlur, onChange, value}])}
    </>;
}

