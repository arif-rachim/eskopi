import voca from "voca";

/**
 * Function to check if the parameter given is a function
 * @param {any} functionToCheck
 * @returns {boolean}
 */
export function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Function to check if a param is null or undefined
 * @param {any} param
 * @returns {boolean}
 */
export function isNullOrUndefined(param) {
    return param === undefined || param === null;
}

/**
 * Function to convert json object into style
 * @param style
 * @returns {string}
 */
export function styleToString(style) {
    return Object.keys(style).reduce((acc, key) => (
        acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
    ), '');
}

/**
 * Function to convert camelCase into sentence case.
 * @param text
 * @returns {string}
 */
export function camelCaseToSentenceCase(text) {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Function to create debounce function
 * @param {function():void} func
 * @param {number} wait
 * @param {boolean} immediate
 * @returns {debouncedFunction}
 */
export function debounce(func, wait = 100, immediate = false) {
    let timeout = 0;

    function debouncedFunction() {
        let context = this;
        let args = arguments;

        function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }

        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    }

    return debouncedFunction;
}


/**
 * Tools to handle double event within 500ms
 * @param {function(event:any,isDouble:boolean)} callback
 * @returns {function(...[*]): void}
 */
export function handleDouble(callback) {
    let lastInvokeTime = 0;
    return (...args) => {
        const current = new Date().getTime();
        let isDouble = (current - lastInvokeTime) < 500;
        callback.apply(this, [...args, isDouble]);
        lastInvokeTime = current;
    }
}

export const isUuid = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

/**
 * To check if parameter is empty
 * @param p
 * @returns {boolean}
 */
export function isEmpty(p) {
    return isNullOrUndefined(p) || p === '';
}

/**
 * Function to check if object is date
 * @param date
 * @returns {boolean}
 */
export function isDate(date) {
    return Object.prototype.toString.call(date) === '[object Date]'
}

/**
 * Function to generate UID
 * @returns {string}
 */
export function uuid() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16)
    });
    return uuid;
}

/**
 * Converts the subject to camelCase.
 * @param string
 * @returns {*}
 */
export function stringToCamelCase(string) {
    return voca.camelCase(string);
}

/**
 * Converts the subject to PascalCase.
 * @param string
 * @returns {*}
 */
export function stringToPascalCase(string) {
    return voca.capitalize(stringToCamelCase(string));
}

/**
 * Converts string to kebab-case
 * @param string
 * @returns {*}
 */
export function stringToKebabCase(string) {
    return voca.slugify(string);
}

export function sanitizeProps(props) {
    const propsToRemove = ['$selectedController', 'setSelectedController', 'dataResource', 'handleSubmit', 'handleLoad', 'vAlign', 'hAlign', 'handleClick', 'buttonType', 'handleChange', 'dataFieldName', 'controllerName'];
    return Object.keys(props).filter(p => propsToRemove.indexOf(p) < 0).reduce((acc, key) => {
        acc[key] = props[key];
        return acc;
    }, {})
}
