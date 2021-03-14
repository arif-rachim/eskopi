import useForm, {Controller} from "components/useForm";
import useObserver, {ObserverValue, useObserverListener} from "components/useObserver";
import {Horizontal, Vertical} from "components/layout/Layout";
import Checkbox from "components/input/Checkbox";
import Button from "components/button/Button";

export default function ConfigureColumnPanel({closePanel, $columns}) {
    const {controller, handleSubmit, reset} = useForm();
    const [$configuredColumns] = useObserver(() => {
        if ($columns?.current === undefined) {
            return;
        }
        const configuredColumns = createDefaultConfiguredColumns($columns.current);
        const formInitialValue = createConfigureColumnFormInitialValue(configuredColumns);
        reset(formInitialValue);
        return configuredColumns;
    });

    useObserverListener($configuredColumns, (configuredColumns) => {
        const formInitialValue = createConfigureColumnFormInitialValue(configuredColumns)
        reset(formInitialValue);
    })
    useObserverListener($columns, (columns) => {
        if ($columns?.current === undefined) {
            return;
        }
        return Object.keys(columns).map(key => {
            return {id: key, visible: true, name: key}
        });
    });

    return <Vertical p={2} gap={2}>
        <Horizontal>Configure Columns</Horizontal>
        <ObserverValue $observers={$configuredColumns}>{
            (configuredColumns) => {
                return <form action="" onSubmit={handleSubmit((data) => {
                    closePanel(data);
                })}>
                    <Vertical>
                        {configuredColumns.map(col => {
                            return <Horizontal key={col.id}>
                                <Controller name={col.name} controller={controller} render={Checkbox}/>
                                {col.name}
                            </Horizontal>
                        })}
                        <Horizontal hAlign={'right'} gap={2}>
                            <Button type={'submit'}>Save</Button>
                            <Button onClick={() => closePanel(false)}>Cancel</Button>
                        </Horizontal>
                    </Vertical>
                </form>
            }
        }</ObserverValue>

    </Vertical>
}

function createDefaultConfiguredColumns(columns) {
    const configuredColumns = Object.keys(columns).map(key => {
        const isPrivate = key.endsWith('_');
        return {id: key, visible: !isPrivate, name: key}
    });
    return configuredColumns;
}

function createConfigureColumnFormInitialValue(configuredColumns) {
    return configuredColumns.reduce((acc, data) => {
        acc[data.name] = data.visible;
        return acc;
    }, {});
}