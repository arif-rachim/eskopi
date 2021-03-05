import React, {useCallback, useRef} from "react";
import useObserver from "components/useObserver";
import {Horizontal, Vertical} from "./layout/Layout";
import Label from "./label/Label";
import {isNullOrUndefined} from "components/utils";

/**
 * Create onSubmit handler
 * @param {React.MutableRefObject<{validateOn: {}, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} controller
 * @returns {function(*=): function(*): void}
 */
const handleSubmitFactory = (controller) => (callback) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    // lets revalidate all errors
    Object.keys(controller.current.validator).forEach(name => {
        const validator = controller.current.validator[name];
        validateError(controller, name, validator, controller.current.$value.current[name]);
    });
    const hasNoError = Object.keys(controller.current.$errors.current).reduce((acc, key) => {
        const hasNoError = !(key in controller.current.$errors.current && controller.current.$errors.current[key].length > 0);
        return hasNoError && acc;
    }, true);
    if (hasNoError) {
        callback.apply(callback, [controller.current.$value.current, controller.current.$errors.current]);
    }

}


/**
 * @param {Object} defaultValue
 * @returns {{handleSubmit: (function(*=): function(*): void), controller: React.MutableRefObject<{validateOn: {}, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, validator: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), setValue: (React.MutableRefObject<*>|setObserver), setErrors: (React.MutableRefObject<*>|setObserver), register: (function(*=): function(*): void)}}
 */
export default function useForm(defaultValue = {}) {
    const [$errors, setErrors] = useObserver({});
    const [$value, setValue] = useObserver({});
    const controller = useRef({
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
    const handleSubmit = useCallback(handleSubmitFactory(controller), []);
    const reset = useCallback((defaultValue) => {
        const {setErrors, setValue} = controller.current;
        Object.keys(controller.current.$errors.current).forEach(key => {
            setErrors(oldErrors => {
                const newErrors = {...oldErrors};
                delete newErrors[key];
                return newErrors;
            });
        });
        controller.current.defaultValue = defaultValue ? defaultValue : controller.current.defaultValue;
        setValue(oldValue => {
            const newValue = {...oldValue};
            Object.keys(oldValue).forEach(key => {
                if (controller.current.defaultValue && key in controller.current.defaultValue) {
                    newValue[key] = controller.current.defaultValue[key];
                } else {
                    delete newValue[key];
                }
            });
            return newValue;
        });

        controller.current.userEditingField = {};
        controller.current.previousValue = {};
        controller.current.modified = {};
    }, []);
    return {
        handleSubmit,
        controller,
        $value,
        setValue,
        $errors,
        setErrors,
        reset
    }
}

/**
 *
 * @param {React.MutableRefObject<{validateOn: {}, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} controller
 * @param {string} name
 * @param {function(*=):string} validator
 * @param {Object} value
 */
function validateError(controller, name, validator, value) {
    let newError = '';
    if (validator) {
        newError = validator.apply(validator, [value, controller.current.$value.current]);
    }
    controller.current.setErrors(oldErrors => {
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
    const {controller, name, validator} = propsRef.current;
    // if user perform editing then this blur should be triggered
    if (controller.current.userEditingField[name]) {
        // here we keep the oldValue
        // const oldValue = controller.current.previousValue[name];
        // here we get the curent value
        const newValue = controller.current.$value.current[name];
        if (controller.current.validateOn[name] === 'blur') {
            validateError(controller, name, validator, newValue);
        }
        // here we save the previous value
        controller.current.previousValue[name] = controller.current.$value.current[name];
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
    controller.current.setValue(oldValue => {
        const newValue = {...oldValue};
        newValue[name] = value;
        return newValue;
    });
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
 * @param {number} horizontalLabelPositionWidth
 * @param {React.MutableRefObject<{validateOn: {}, $errors: (React.MutableRefObject<*>|setObserver), $value: (React.MutableRefObject<*>|setObserver), defaultValue: {}, setValue: (React.MutableRefObject<*>|setObserver), userEditingField: {}, modified: {}, setErrors: (React.MutableRefObject<*>|setObserver), value: {}, previousValue: {}, errors: {}}>} controller
 * @returns {JSX.Element}
 * @constructor
 */
export function Controller({
                               name,
                               label,
                               validator,
                               validateOn = 'blur',
                               render,
                               controller,
                               horizontalLabelPositionWidth,
                               containerStyle,
                               ...props
                           }) {
    if (isNullOrUndefined(controller)) {
        throw Error('Please define controller object from useForm');
    }
    controller.current.validateOn[name] = validateOn;
    controller.current.validator[name] = validator;
    if (!controller.current.modified[name]) {
        controller.current.$value.current[name] = controller.current.defaultValue[name]
    }
    const propsRef = useRef({controller, name, validator});
    propsRef.current = {controller, name, validator};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onBlur = useCallback(callbackOnBlur(propsRef), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                flex={`1 0 ${horizontalLabelPositionWidth}px`}>{label}</Horizontal>
                    <Render name={name} onBlur={onBlur} onChange={onChange} $value={controller.current.$value}
                            $errors={controller.current.$errors} {...props} style={{width: '100%'}}/>
                </Horizontal>
                }
                {!isHorizontal &&
                <Vertical>
                    <Horizontal style={{fontSize: '0.8rem'}}>{label}</Horizontal>
                    <Render name={name} onBlur={onBlur} onChange={onChange} $value={controller.current.$value}
                            $errors={controller.current.$errors} {...props}/>
                </Vertical>
                }
                <Label name={name} color={'danger'} $value={controller.current.$errors}
                       style={{fontSize: '0.7rem', position: 'absolute', bottom: -12, right: 0}}/>
            </Vertical>
        </label>
    </Vertical>;
}

