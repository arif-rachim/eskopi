import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import Select from "components/input/Select";
import useObserver, {ObserverValue, useObserverListener, useObserverMapper} from "components/useObserver";
import useResource, {useResourceListener} from "components/useResource";
import Button from "../../../components/button/Button";
import useSlideDownPanel from "../../../components/page/useSlideDownPanel";
import {SYSTEM_TABLES} from "../../../components/SystemTableName";
import InputTable from "../../../components/table/InputTable";
import Input, {mapToNameFactory} from "../../../components/input/Input";
import {isNullOrUndefined, stringToCamelCase} from "../../../components/utils";
import {v4 as uuid} from "uuid";
import requireValidator from "components/validators/requireValidator";
import {useConfirmMessage} from "components/dialog/Dialog";

function DataPanel({control}) {

    return <Vertical p={2} gap={2}>
        <Controller name={'dataResource'}
                    control={control}
                    render={DataResourceRenderer}
        />
    </Vertical>
}

function DataResourceRenderer({$value, name, onChange}) {

    const $formValue = useObserverMapper($value, mapToNameFactory(name));
    const showPanel = useSlideDownPanel();
    return <Horizontal vAlign={'center'}>
        <Horizontal flex={'1 0 auto'}>Data Resource</Horizontal>
        <ObserverValue $observers={$formValue}>
            {(formValue) => {
                const hasValue = !isNullOrUndefined(formValue);
                return <Button color={hasValue ? "secondary" : "light"} onClick={async () => {
                    const result = await showPanel(DataResourcePanel, {$formValue});
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

function DataResourcePanel({closePanel, $formValue}) {

    const [$data, setData] = useObserver();
    const [$onLoadTableNames] = useResource({url: `/db/${SYSTEM_TABLES}`});
    const {control, $value, handleSubmit, reset} = useForm($formValue?.current);
    useObserverListener($formValue, formValue => {
        reset(formValue);
    });

    useResourceListener($onLoadTableNames, (status, result) => {
        if (status === 'success') {
            setData(result);
        }
    });
    const $selectedTable = useObserverMapper($value, value => value?.resource);
    const [$columns] = useObserver({
        field: {
            title: 'Column',
            width: '30%',
            $selectedTable,
            renderer: FieldCellRenderer
        },
        type: {
            title: 'Filter',
            width: '30%',
            $selectedTable,
            renderer: FilterCellRenderer
        },
        condition: {
            title: 'Condition',
            width: '30%',
            renderer: ConditionCellRenderer
        },
        deleteColumn: {
            title: '',
            width: '10%',
            onChange: (data) => control.current.onChange.filter(data),
            renderer: DeleteCellRenderer
        }
    });
    const showConfirmation = useConfirmMessage();
    return <Vertical gap={2} p={2} width={520}>
        <Horizontal style={{fontSize: 22}} hAlign={'center'}>Data Resource</Horizontal>
        <form action="" onSubmit={handleSubmit(data => {
            closePanel(data);
        })}>
            <Vertical>
                <Controller render={Select}
                            name={'resource'}
                            label={'Resource'}
                            $data={$data}
                            control={control}
                            dataToLabel={data => data?.tableName}
                            validator={requireValidator('Resource')}
                />
                <Horizontal pT={4} pB={2} hAlign={'right'}>
                    <Button type={'button'} onClick={() => {
                        control.current.onChange.filter(oldField => {
                            oldField = oldField || [];
                            return [...oldField, {id: uuid(), name: '', type: '', condition: ''}]
                        })
                    }}>Add Field</Button>
                </Horizontal>
                <Controller render={InputTable}
                            name={'filter'}
                            control={control}
                            $columns={$columns}
                            validator={requireValidator('Filter')}
                />
                <Horizontal hAlign={'right'} gap={2} pT={2}>
                    <Button type={'button'} onClick={async () => {
                        const result = await showConfirmation('Are you sure you want to remove this DataResouce link ?')
                        if (result === 'YES') {
                            closePanel('REMOVE');
                        }
                    }}>Remove</Button>
                    <Horizontal flex={'1 0 auto'}/>
                    <Button color={"primary"} type={'submit'}>Save</Button>
                    <Button type={'button'} onClick={(event) => {
                        closePanel();
                    }}>Close</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}

function DeleteCellRenderer({$tableData, rowIndex, colIndex, field, onChange, $columns, ...props}) {
    return <Button type={'button'} onClick={() => {

        const changeFilter = $columns.current[field].onChange;
        changeFilter(oldField => {
            const newField = [...oldField];
            newField.splice(rowIndex, 1);
            return newField;
        })
    }}>❌</Button>
}

function FilterCellRenderer({$tableData, rowIndex, colIndex, field, onChange, $columns, ...props}) {
    const $value = useObserverMapper($tableData, tableData => {
        if (tableData && tableData[rowIndex] && tableData[rowIndex][field]) {
            return tableData[rowIndex][field];
        }
        return undefined;
    });

    const $selectedTable = $columns.current[field].$selectedTable;
    useObserverListener($selectedTable, newTable => {
        console.log('We got new Table', newTable);
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = '';
            return nextValue;
        });
    });
    return <Input $value={$value} autoCaps={false} onChange={value => {
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = stringToCamelCase(value)
            return nextValue;
        });
    }}/>
}

function FieldCellRenderer({$tableData, rowIndex, colIndex, field, onChange, $columns, ...props}) {
    const $selectedTable = $columns.current[field].$selectedTable;
    const $value = useObserverMapper($tableData, tableData => {
        if (tableData && tableData[rowIndex] && tableData[rowIndex][field]) {
            return tableData[rowIndex][field];
        }
        return undefined;
    });
    const [$data, setData] = useObserver($selectedTable?.current?.fields);
    useObserverListener($selectedTable, newTable => {
        console.log('Dang ! got new Table', newTable);
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = null;
            return nextValue;
        });
        setData(newTable?.fields);
    });
    return <Select $value={$value} onChange={value => {
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = value;
            return nextValue;
        });
    }} $data={$data} dataToLabel={data => data?.name}/>
}

function ConditionCellRenderer({$tableData, rowIndex, colIndex, field, onChange, ...props}) {
    const $value = useObserverMapper($tableData, tableData => {
        if (tableData && tableData[rowIndex] && tableData[rowIndex][field]) {
            return tableData[rowIndex][field];
        }
        return undefined;
    });
    const [$data] = useObserver([
        {id: 'IsEqualTo', label: 'Is equal to'},
        {id: 'IsNotEqualTo', label: 'Is not equal to'},
        {id: 'StartsWith', label: 'Starts with'},
        {id: 'Contains', label: 'Contains'},
        {id: 'DoesNotContain', label: 'Does not contain'},
        {id: 'EndsWith', label: 'Ends with'},
        {id: 'IsNull', label: 'Is null'}
    ]);
    return <Select $value={$value} style={{width: '100%'}} onChange={value => {
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = value;
            return nextValue;
        });
    }} $data={$data} dataToLabel={data => data?.label}/>
}

DataPanel.title = 'Data Resource'
export default DataPanel;