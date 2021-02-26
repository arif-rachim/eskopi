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