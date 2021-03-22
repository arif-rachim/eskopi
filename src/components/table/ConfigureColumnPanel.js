import useForm, {Controller} from "components/useForm";
import {ObserverValue, useObserverListener} from "components/useObserver";
import {Horizontal, Vertical} from "components/layout/Layout";
import Checkbox from "components/input/Checkbox";
import Button from "components/button/Button";

// $value is formInitialValue
export default function ConfigureColumnPanel({$columns, $value, closePanel: onChange}) {
    const {control, handleSubmit, reset} = useForm($value?.current);

    useObserverListener($value, (formInitialValue) => {
        reset(formInitialValue);
    });

    return <Vertical p={2} gap={2}>
        <Horizontal>Configure Columns</Horizontal>
        <ObserverValue $observers={$columns}>{
            (columns) => {
                columns = Object.keys(columns).map(col => ({id: col, name: col}));
                return <form action="" onSubmit={handleSubmit((data) => {
                    onChange(data);
                })}>
                    <Vertical>
                        {columns.map(col => {
                            return <Horizontal key={col.id}>
                                <Controller name={col.name} control={control} render={Checkbox}/>
                                {col.name}
                            </Horizontal>
                        })}
                        <Horizontal hAlign={'right'} gap={2}>
                            <Button type={'submit'}>Save</Button>
                            <Button onClick={() => onChange(false)}>Cancel</Button>
                        </Horizontal>
                    </Vertical>
                </form>
            }
        }</ObserverValue>
    </Vertical>
}

export function createDefaultColumnsArray(columns) {
    columns = columns || {};
    const configuredColumns = Object.keys(columns).map(key => {
        const isPrivate = key.endsWith('_');
        return {id: key, visible: !isPrivate, name: key}
    });
    return configuredColumns;
}

export function createDefaultColumnsObject(configuredColumns) {
    return configuredColumns.reduce((acc, data) => {
        acc[data.name] = data.visible;
        return acc;
    }, {});
}