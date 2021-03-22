import {Horizontal, Vertical} from "components/layout/Layout";
import {useEffect} from "react";
import Panel from "components/panel/Panel";
import List from "components/list/List";
import AutoPopulateColumnTable from "components/table/AutoPopulateColumnTable";
import useObserver from "components/useObserver";
import useResource, {useResourceListener} from "components/useResource";
import {SYSTEM_TABLES} from "components/SystemTableName";
import Button from "components/button/Button";
import useSlideDownStackPanel from "components/page/useSlideDownStackPanel";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import {isUndefinedOrNull} from "components/utils";
import {v4 as uuid} from "uuid";
import Table from "components/table/Table";


export default function DbDesigner({setTitle}) {
    useEffect(() => {
        setTitle('DB Designer');
    }, [setTitle]);
    const [$onTableLoaded] = useResource({url: `/db/${SYSTEM_TABLES}`})
    const [$table, setTable] = useObserver([]);
    const [$selectedTable, setSelectedTable] = useObserver();
    const [$tableContent] = useObserver();
    useResourceListener($onTableLoaded, (status, result) => {
        if (status === 'success') {
            setTable(result);
        }
    })
    return <Horizontal width={'100%'} height={'100%'}>
        <Vertical color={'light'} brightness={1} bR={1} height={'100%'} flex={'0 0 200px'}>
            <Panel headerTitle={'Tables'} headerRenderer={PanelHeaderRenderer}>
                <List $data={$table}
                      dataKey={data => data?.id_}
                      $value={$selectedTable}
                      onChange={setSelectedTable}
                      dataToLabel={data => data?.label}
                />
            </Panel>
        </Vertical>
        <Vertical color={'light'} brightness={1} flex={'1 0 auto'}>
            <AutoPopulateColumnTable $data={$tableContent} dataKey={data => data?.id_}/>
        </Vertical>
    </Horizontal>
}

function PanelHeaderRenderer() {
    const showSlideDown = useSlideDownStackPanel();
    return <Horizontal vAlign={'center'}>
        <Horizontal flex={'1 0 auto'}>{'Tables'}</Horizontal>
        <Button onClick={async () => {
            await showSlideDown(AddTablePanel);
        }}>Add</Button>
    </Horizontal>
}

function AddTablePanel(props) {
    const {control, handleSubmit} = useForm();
    const [$tableData, setTableData] = useObserver([]);
    const [$columns, setColumns] = useObserver({});
    return <form action="" onSubmit={handleSubmit(data => {
        debugger;
        console.log(data);
    })}>
        <Vertical gap={2} p={2} elevation={2} width={300}>
            <Controller control={control} render={Input} name={"tableName"}
                        label={'Table Name'}
                        validator={requiredValidator('Table Name')}/>
            <Controller control={control}
                        render={Table}
                        name={"fields"}
                        label={'Fields'}
                        $columns={$columns}
                        $data={$tableData}
                        validator={requiredValidator('Table Name')}/>
            <Horizontal hAlign={'right'} gap={2}>
                <Button type={'button'} onClick={() => {
                    setTableData(oldData => {
                        return [...oldData, {
                            id: uuid(),
                            name: '',
                            type: 'string'
                        }]
                    })
                }}>Add Field</Button>
                <Horizontal flex={'1 0 auto'}/>
                <Button type={'submit'}>Save</Button>
                <Button type={'reset'}>Cancel</Button>
            </Horizontal>

        </Vertical>
    </form>

}

function requiredValidator(fieldName) {
    return function validator(value) {
        if (isUndefinedOrNull(value) || value === '') {
            return fieldName + ' is required';
        }
        return '';
    }
}