import {ObserverValue, useObserverMapper} from "components/useObserver";
import {mapToNameFactory} from "components/input/Input";
import useSlideDownPanel from "components/page/useSlideDownPanel";
import {Horizontal} from "components/layout/Layout";
import {isNullOrUndefined} from "components/utils";
import Button from "components/button/Button";

export default function InputWithSlideDownDetail({$value, name, onChange, title, detailPanel}) {
    const DetailPanel = detailPanel;
    const $formValue = useObserverMapper($value, mapToNameFactory(name));
    const showPanel = useSlideDownPanel();
    return <Horizontal vAlign={'center'}>
        <Horizontal flex={'1 0 auto'}>{title}</Horizontal>
        <ObserverValue $observers={$formValue}>
            {(formValue) => {
                const hasValue = !isNullOrUndefined(formValue);
                return <Button color={hasValue ? "secondary" : "light"} onClick={async () => {
                    const result = await showPanel(DetailPanel, {$formValue, name, $value});
                    if (result === 'REMOVE') {
                        onChange(undefined);
                        return;
                    }
                    if (result === false) {
                        return;
                    }
                    onChange(result);
                }}>Update</Button>
            }}
        </ObserverValue>
    </Horizontal>
}