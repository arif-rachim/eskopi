import React, {useCallback, useRef} from "react";
import useObserver from "components/useObserver";
import {Horizontal, Vertical} from "./layout/Layout";
import Label from "./label/Label";
import {isNullOrUndefined} from "components/utils";

/**
 * Create onSubmit handler
 * @param {React.MutableRefObject<{validateOn: {}, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} control
 * @returns {function(*=): function(*): void}
 */
const handleSubmitFactory = (control) => (callback) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    // lets revalidate all errors
    Object.keys(control.current.validator).forEach(name => {
        const validator = control.current.validator[name];
        validateError(control, name, validator, control.current.$value.current[name]);
    });
    const hasNoError = Object.keys(control.current.$errors.current).reduce((acc, key) => {
        const hasNoError = !(key in control.current.$errors.current && control.current.$errors.current[key].length > 0);
        return hasNoError && acc;
    }, true);
    if (hasNoError) {
        callback.apply(callback, [control.current.$value.current, control.current.$errors.current]);
    }

}


/**
 * @param {Object} defaultValue
 * @returns {{handleSubmit: (function(*=): function(*): void), control: React.MutableRefObject<{validateOn: {}, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, validator: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), setValue: (React.MutableRefObject<*>|setObserver), setErrors: (React.MutableRefObject<*>|setObserver), register: (function(*=): function(*): void)}}
 */
export default function useForm(defaultValue = {}) {
    const [$errors, setErrors] = useObserver({});
    const [$value, setValue] = useObserver({});
    const control = useRef({
        defaultValue,
        userEditingField: {},
        previousValue: {},
        modified: {},
        $value,
        setValue,
        $errors,
        setErrors,
        validateOn: {},
        validator: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSubmit = useCallback(handleSubmitFactory(control), []);
    const reset = useCallback(function resetForm(defaultValue) {
        const {setErrors, setValue} = control.current;
        Object.keys(control.current.$errors.current).forEach(key => {
            setErrors(oldErrors => {
                const newErrors = {...oldErrors};
                delete newErrors[key];
                return newErrors;
            });
        });
        control.current.defaultValue = defaultValue ? defaultValue : control.current.defaultValue;
        setValue(oldValue => {
            const newValue = {...oldValue};
            Object.keys(oldValue).forEach(key => {
                if (control.current.defaultValue) {
                    newValue[key] = control.current.defaultValue[key];
                } else {
                    delete newValue[key];
                }
            });
            return newValue;
        });

        control.current.userEditingField = {};
        control.current.previousValue = {};
        control.current.modified = {};
    }, []);
    return {
        handleSubmit,
        control,
        $value,
        setValue,
        $errors,
        setErrors,
        reset
    }
}

/**
 *
 * @param {React.MutableRefObject<{validateOn: {}, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} control
 * @param {string} name
 * @param {function(*=):string} validator
 * @param {Object} value
 */
function validateError(control, name, validator, value) {
    let newError = '';
    if (validator) {
        newError = validator.apply(validator, [value, control.current.$value.current]);
    }
    control.current.setErrors(oldErrors => {
        const newErrors = {...oldErrors};
        newErrors[name] = newError;
        return newErrors;
    });
}

/**
 *
 * @param propsRef
 * @returns {function(): void}
 */
const callbackOnBlur = (propsRef) => () => {
    const {control, name, validator} = propsRef.current;
    // if user perform editing then this blur should be triggered
    if (control.current.userEditingField[name]) {
        // here we keep the oldValue
        // const oldValue = control.current.previousValue[name];
        // here we get the curent value
        const newValue = control.current.$value.current[name];
        if (control.current.validateOn[name] === 'blur') {
            validateError(control, name, validator, newValue);
        }
        // here we save the previous value
        control.current.previousValue[name] = control.current.$value.current[name];
        // here we set the editing is done !
        control.current.userEditingField[name] = false;
    }
};

/**
 *
 * @param {Object} propsRef
 * @returns {function(*=): void}
 */
const callbackOnChange = (propsRef) => function onChangeCallback(value) {
    const {control, name, validator} = propsRef.current;
    // here we flag that the user actually did perform editing
    control.current.userEditingField[name] = true;
    // here is the flag to store the value
    control.current.setValue(oldValue => {
        const newValue = {...oldValue};
        newValue[name] = value;
        return newValue;
    });
    // this is the flag indicates that the field has been modified
    control.current.modified[name] = true;
    if (control.current.validateOn[name] === 'change') {
        validateError(control, name, validator, value);
    }
};

/**
 *
 * @param {string} name
 * @param {string} label
 * @param {function(value)} validator
 * @param {'change'|'blur'} validateOn
 * @param {React.Element} render
 * @param {number} horizontalLabelPositionWidth
 * @param {React.MutableRefObject<{validateOn: {}, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} control
 * @returns {JSX.Element}
 * @constructor
 */
export function Controller({
                               name,
                               label,
                               validator,
                               validateOn = 'blur',
                               render,
                               control,
                               horizontalLabelPositionWidth,
                               containerStyle,
                               ...props
                           }) {
    if (isNullOrUndefined(control)) {
        throw Error('Please define control object from useForm');
    }
    control.current.validateOn[name] = validateOn;
    control.current.validator[name] = validator;
    if (!control.current.modified[name]) {
        control.current.$value.current[name] = control.current.defaultValue[name]
    }
    const propsRef = useRef({control, name, validator});
    propsRef.current = {control, name, validator};
    // eslint-disable-next-line
    const onBlur = useCallback(callbackOnBlur(propsRef), []);
    // eslint-disable-next-line
    const onChange = useCallback(callbackOnChange(propsRef), []);
    const Render = useRef(render).current;
    containerStyle = containerStyle || {};

    const isHorizontal = horizontalLabelPositionWidth > 0;
    return <Vertical overflow={'visible'} style={containerStyle}>
        <label>
            <Vertical overflow={'visible'}>
                {isHorizontal &&
                <Horizontal flex={'1 0 auto'} vAlign={'center'}>
                    <Horizontal style={{fontSize: '0.8rem', whiteSpace: 'nowrap'}}
                                flex={`0 0 ${horizontalLabelPositionWidth}px`}>{label}</Horizontal>

                    <Render name={name} onBlur={onBlur} onChange={onChange} $value={control.current.$value}
                            $errors={control.current.$errors} {...props} style={{width: '100%'}}/>

                </Horizontal>
                }
                {!isHorizontal &&
                <Vertical>
                    <Horizontal style={{fontSize: '0.8rem'}}>{label}</Horizontal>
                    <Render name={name} onBlur={onBlur} onChange={onChange} $value={control.current.$value}
                            $errors={control.current.$errors} {...props}/>
                </Vertical>
                }
                <Label name={name} color={'danger'} $value={control.current.$errors}
                       style={{fontSize: '0.7rem', position: 'absolute', bottom: -12, right: 0}}/>
            </Vertical>
        </label>
    </Vertical>;
}

