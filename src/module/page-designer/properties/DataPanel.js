import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import Select from "components/input/Select";
import useObserver, {useObserverMapper} from "components/useObserver";
import useResource, {useResourceListener} from "components/useResource";
import Button from "../../../components/button/Button";
import useSlideDownPanel from "../../../components/page/useSlideDownPanel";
import {SYSTEM_TABLES} from "../../../components/SystemTableName";
import InputTable from "../../../components/table/InputTable";
import Input from "../../../components/input/Input";
import {stringToCamelCase} from "../../../components/utils";
import {v4 as uuid} from "uuid";

function DataPanel({control}) {
    const [$data, setData] = useObserver();
    // const [$onLoadTableNames] = useResource({url: '/db/'});
    // useResourceListener($onLoadTableNames, (status, result) => {
    //     if (status === 'success') {
    //         setData(result);
    //     }
    // });
    return <Vertical p={2} gap={2}>
        <Controller name={'dataResource'}
                    control={control}
                    render={DataResourceRenderer}
        />


        {/*<Controller label={'Resource'} horizontalLabelPositionWidth={50}*/}
        {/*            name={'resourceTable'}*/}
        {/*            flex={'1 0 auto'}*/}
        {/*            render={Select}*/}
        {/*            autoCaps={false}*/}
        {/*            $data={$data}*/}
        {/*            control={control}*/}
        {/*            dataKey={data => data?.id}*/}
        {/*            dataToLabel={data => data?.label}*/}
        {/*/>*/}
    </Vertical>
}

function DataResourceRenderer({$value, onChange}) {
    const showPanel = useSlideDownPanel();
    return <Horizontal vAlign={'center'}>
        <Horizontal flex={'1 0 auto'}>Data Resource</Horizontal>
        <Button onClick={async () => {
            const result = await showPanel(DataResourcePanel);
            debugger;
        }}>Update</Button>
    </Horizontal>
}

function DataResourcePanel({closePanel}) {

    const [$data, setData] = useObserver();
    const [$onLoadTableNames] = useResource({url: `/db/${SYSTEM_TABLES}`});
    const {control, $value} = useForm();
    useResourceListener($onLoadTableNames, (status, result) => {
        if (status === 'success') {
            setData(result);
        }
    });
    const [$columns] = useObserver({
        field: {
            title: 'Field',
            width: '33.33%',
            $selectedTable: useObserverMapper($value, value => value?.table),
            renderer: FieldCellRenderer
        },
        type: {
            title: 'Filter',
            width: '33.33%',
            renderer: FilterCellRenderer
        },
        condition: {
            title: 'Condition',
            width: '33.33%',
            renderer: ConditionCellRenderer
        }
    })
    return <Vertical gap={2} p={2} width={800}>
        <Horizontal style={{fontSize: 18}}>This is Data Resource</Horizontal>
        <Controller render={Select}
                    name={'table'}
                    $data={$data}
                    control={control}
                    dataToLabel={data => data?.tableName}
        />
        <Controller render={InputTable}
                    name={'filter'}
                    control={control}
                    $columns={$columns}
        />
        <Horizontal hAlign={'right'}>
            <Button type={'button'} onClick={() => {
                control.current.onChange.filter(oldField => {
                    oldField = oldField || [];
                    return [...oldField, {id: uuid(), name: '', type: '', condition: ''}]
                })
            }}>Add Field</Button>
            <Horizontal flex={'1 0 auto'}/>
            <Button onClick={() => {
                closePanel(true);
            }}>Close</Button>
        </Horizontal>
    </Vertical>
}

function FilterCellRenderer({$tableData, rowIndex, colIndex, field, onChange, ...props}) {
    const $value = useObserverMapper($tableData, tableData => {
        return tableData[rowIndex][field];
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
        return tableData[rowIndex][field];
    });
    const [$data] = useObserver(() => {
        if ($selectedTable?.current?.fields) {
            return $selectedTable?.current?.fields;
        }
        return []
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
        return tableData[rowIndex][field];
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
    }} $data={$data} dataToLabel={data => data.label}/>
}

DataPanel.title = 'Data Resource'
export default DataPanel;