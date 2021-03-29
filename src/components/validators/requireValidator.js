import {isNullOrUndefined} from "components/utils";

export default function requireValidator(name) {
    return (value) => {
        if (isNullOrUndefined(value) || value === '') {
            return name + ' is required';
        }
        return '';
    }
}