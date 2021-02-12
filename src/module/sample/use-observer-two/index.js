import useObserver, {useObserverValue} from "components/useObserver";
import {Vertical} from "components/layout/Layout";
import Button from "components/button/Button";

export default function UserObserverTwo() {
    const [$value, setValue] = useObserver({value: ''});
    const [$toggle, setToggle] = useObserver(true);
    const toggle = useObserverValue($toggle);
    if (toggle) {
        return <ToggleScreen setValue={setValue} setToggle={setToggle}/>
    }
    return <Vertical>
        <PrintText $value={$value}/>
    </Vertical>
}

function PrintText({$value}) {
    const value = useObserverValue($value);
    return <Vertical>
        {JSON.stringify(value)}
    </Vertical>
}

function ToggleScreen({setValue, setToggle}) {
    return <Vertical>
        <Button onClick={() => {
            setValue({value: 'shoot'});
            setToggle(false);
        }}>Click and set value</Button>
    </Vertical>
}