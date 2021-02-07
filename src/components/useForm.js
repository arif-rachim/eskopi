import React, {useCallback, useRef} from "react";
import useStateObserver from "components/useStateObserver";
import {Horizontal, Vertical} from "./layout/Layout";
import Label from "./label/Label";

/**
 * Create onSubmit handler
 * @param {React.MutableRefObject<{validateOn: {}, errorsObserver: (React.MutableRefObject<*>|setObserver), valueObserver: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} controller
 * @returns {function(*=): function(*): void}
 */
const handleSubmitFactory = (controller) => (callback) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    // lets revalidate all errors
    Object.keys(controller.current.validator).forEach(name => {
        const validator = controller.current.validator[name];
        validateError(controller, name, validator, controller.current.valueObserver.current[name]);
    });
    const hasNoError = Object.keys(controller.current.errorsObserver.current).reduce((acc, key) => {
        const hasNoError = !(key in controller.current.errorsObserver.current && controller.current.errorsObserver.current[key].length > 0);
        return hasNoError && acc;
    }, true);
    if (hasNoError) {
        callback.apply(callback, [controller.current.valueObserver.current, controller.current.errorsObserver.current]);
    }

}

/**
 * Create register method
 * @param {React.MutableRefObject<{validateOn: {}, errorsObserver: (React.MutableRefObject<*>|setObserver), valueObserver: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} controller
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
        const onChange = callbackOnChange(propsRef, () => {
        });
        input.addEventListener('input', (event) => {
            onChange(event.target.value);
        });
        input.addEventListener('blur', onBlur);
    }, []);
}

/**
 * @param {Object} defaultValue
 * @returns {{handleSubmit: (function(*=): function(*): void), controller: React.MutableRefObject<{validateOn: {}, errorsObserver: (React.MutableRefObject<*>|setObserver), valueObserver: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, validator: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>, errorsObserver: (React.MutableRefObject<*>|setObserver), valueObserver: (React.MutableRefObject<*>|setObserver), setValue: (React.MutableRefObject<*>|setObserver), setErrors: (React.MutableRefObject<*>|setObserver), register: (function(*=): function(*): void)}}
 */
export default function useForm(defaultValue = {}) {
    const [errorsObserver, setErrors] = useStateObserver({});
    const [valueObserver, setValue] = useStateObserver({});
    const controller = useRef({
        defaultValue,
        userEditingField: {},
        previousValue: {},
        modified: {},
        valueObserver,
        setValue,
        errorsObserver,
        setErrors,
        validateOn: {},
        validator: {}
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSubmit = useCallback(handleSubmitFactory(controller), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const register = useCallback(registerFactory(controller), []);
    const reset = useCallback((defaultValue) => {
        const {setErrors, setValue} = controller.current;
        Object.keys(controller.current.errorsObserver.current).forEach(key => {
            setErrors(key, '');
        });
        controller.current.defaultValue = defaultValue ? defaultValue : controller.current.defaultValue;
        Object.keys(controller.current.valueObserver.current).forEach(key => {
            if (controller.current?.defaultValue && key in controller.current.defaultValue) {
                setValue(key, controller.current.defaultValue[key]);
            } else {
                setValue(key, '');
            }

        })

        controller.current.userEditingField = {};
        controller.current.previousValue = {};
        controller.current.modified = {};
    }, []);
    return {
        handleSubmit,
        register,
        controller,
        valueObserver,
        setValue,
        errorsObserver,
        setErrors,
        reset
    }
}

/**
 *
 * @param {React.MutableRefObject<{validateOn: {}, errorsObserver: (React.MutableRefObject<*>|setObserver), valueObserver: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} controller
 * @param {string} name
 * @param {function(*=):string} validator
 * @param {Object} value
 */
function validateError(controller, name, validator, value) {
    let newError = '';
    if (validator) {
        newError = validator.apply(validator, [value, controller.current.valueObserver.current]);
    }
    controller.current.setErrors(name, newError);
}

/**
 *
 * @param propsRef
 * @returns {function(): void}
 */
const callbackOnBlur = (propsRef) => () => {
    const {controller, name, validator} = propsRef.current;
    // if user perform editing then this blur should be triggered
    if (controller.current.userEditingField[name]) {
        // here we keep the oldValue
        // const oldValue = controller.current.previousValue[name];
        // here we get the curent value
        const newValue = controller.current.valueObserver.current[name];
        if (controller.current.validateOn[name] === 'blur') {
            validateError(controller, name, validator, newValue);
        }
        // here we save the previous value
        controller.current.previousValue[name] = controller.current.valueObserver.current[name];
        // here we set the editing is done !
        controller.current.userEditingField[name] = false;
    }
};

/**
 *
 * @param {Object} propsRef
 * @returns {function(*=): void}
 */
const callbackOnChange = (propsRef) => (value) => {
    const {controller, name, validator} = propsRef.current;
    // here we flag that the user actually did perform editing
    controller.current.userEditingField[name] = true;
    // here is the flag to store the value
    controller.current.setValue(name, value);
    // this is the flag indicates that the field has been modified
    controller.current.modified[name] = true;
    if (controller.current.validateOn[name] === 'change') {
        validateError(controller, name, validator, value);
    }
};

/**
 *
 * @param {string} name
 * @param {string} label
 * @param {function(value)} validator
 * @param {'change'|'blur'} validateOn
 * @param {React.Element} render
 * @param {React.MutableRefObject<{validateOn: {}, errorsObserver: (React.MutableRefObject<*>|setObserver), valueObserver: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} controller
 * @param {*} props
 * @returns {JSX.Element}
 * @constructor
 */
export function Controller({name, label, validator, validateOn = 'blur', render, controller, ...props}) {
    controller.current.validateOn[name] = validateOn;
    controller.current.validator[name] = validator;
    if (!controller.current.modified[name]) {
        controller.current.valueObserver.current[name] = controller.current.defaultValue[name]
    }
    const propsRef = useRef({controller, name, validator});
    propsRef.current = {controller, name, validator};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onBlur = useCallback(callbackOnBlur(propsRef), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChange = useCallback(callbackOnChange(propsRef), []);
    const Render = useRef(render).current;
    return <Vertical overflow={'visible'}>
        <label>
            <Vertical overflow={'visible'} mB={2}>
                <Horizontal style={{fontSize: '0.8rem'}}>{label}</Horizontal>
                <Render name={name} onBlur={onBlur} onChange={onChange} valueObserver={controller.current.valueObserver}
                        errorsObserver={controller.current.errorsObserver} {...props}/>
                <Label name={name} color={'danger'} observer={controller.current.errorsObserver}
                       style={{fontSize: '0.7rem', position: 'absolute', bottom: -12, right: 0}}/>
            </Vertical>
        </label>
    </Vertical>;
}

