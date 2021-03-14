import {useObserverMapper, useObserverValue} from "components/useObserver";
import {parseBorder, Vertical} from "components/layout/Layout";
import useTheme from "components/useTheme";

export default function Checkbox({name, onChange, onBlur, $value, $errors, $disabled, color}) {
    const $nameValue = useObserverMapper($value, value => value[name]);
    const $errorValue = useObserverMapper($errors, value => value[name]);
    let errorMessage = useObserverValue($errorValue);
    const isDisabled = useObserverValue($disabled);
    const checked = useObserverValue($nameValue) || false;
    color = errorMessage && errorMessage.length > 0 ? 'danger' : color || 'light';
    const theme = useTheme();
    const borderStyle = parseBorder({b: 1, bL: 1, bT: 1, bR: 1, bB: 1}, color, theme);
    return <Vertical flex={'1 0 auto'} hAlign={'left'}>
        <input type="checkbox" name={name} checked={checked}
               disabled={isDisabled}
               style={borderStyle}
               onChange={(event) => {
                   onChange(event.target.checked)
               }}/>
    </Vertical>
}