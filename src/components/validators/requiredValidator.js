import {isUndefinedOrNull} from "components/utils";

export default function requiredValidator(name) {
    return (value) => {
        if (isUndefinedOrNull(name) || value === '') {
            return name + ' is required';
        }
        return '';
    }
}