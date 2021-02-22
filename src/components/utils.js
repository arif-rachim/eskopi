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