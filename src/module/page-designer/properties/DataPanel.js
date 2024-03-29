import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import Select from "components/input/Select";
import useObserver, {useObserverListener, useObserverMapper} from "components/useObserver";
import useResource, {useResourceListener} from "components/useResource";
import Button from "../../../components/button/Button";
import {SYSTEM_TABLES} from "components/SystemTableName";
import InputTable from "../../../components/table/InputTable";
import requireValidator from "components/validators/requireValidator";
import {useConfirmMessage} from "components/dialog/Dialog";
import InputWithSlideDownDetail from "components/input/InputWithSlideDownDetail";
import SelectCellRenderer from "module/page-designer/properties/renderer/SelectCellRenderer";
import InputCellRenderer from "module/page-designer/properties/renderer/InputCellRenderer";
import DeleteCellRenderer from "module/page-designer/properties/renderer/DeleteCellRenderer";
import {uuid} from "components/utils";

function DataPanel({control}) {
    return <Vertical p={2} gap={2}>
        <Controller name={'dataResource'}
                    control={control}
                    render={InputWithSlideDownDetail}
                    title={'Data Resource'}
                    detailPanel={DetailPanel}
        />
    </Vertical>
}


function DetailPanel({closePanel, $formValue}) {
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
    const $columnData = useObserverMapper($value, value => value?.resource?.fields);
    const [$columns] = useObserver({
        field: {
            title: 'Column',
            width: '30%',
            $data: $columnData,
            dataToLabel: data => data?.name,
            renderer: SelectCellRenderer
        },
        type: {
            title: 'Filter',
            width: '30%',
            renderer: InputCellRenderer
        },
        condition: {
            title: 'Condition',
            width: '30%',
            dataToLabel: data => data?.label,
            $data: useObserver([
                {id: 'IsEqualTo', label: 'Is equal to'},
                {id: 'IsNotEqualTo', label: 'Is not equal to'},
                {id: 'StartsWith', label: 'Starts with'},
                {id: 'Contains', label: 'Contains'},
                {id: 'DoesNotContain', label: 'Does not contain'},
                {id: 'EndsWith', label: 'Ends with'},
                {id: 'IsNull', label: 'Is null'}
            ])[0],
            renderer: SelectCellRenderer
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
                    }}>Add Filter</Button>
                </Horizontal>
                <Controller render={InputTable}
                            name={'filter'}
                            control={control}
                            $columns={$columns}
                />
                <Horizontal hAlign={'right'} gap={2} pT={2}>
                    <Button type={'button'} onClick={async () => {
                        const result = await showConfirmation('Are you sure you want to remove this DataResource link ?')
                        if (result === 'YES') {
                            closePanel('REMOVE');
                        }
                    }}>Remove</Button>
                    <Horizontal flex={'1 0 auto'}/>
                    <Button color={"primary"} type={'submit'}>Save</Button>
                    <Button type={'button'} onClick={(event) => {
                        closePanel(false);
                    }}>Close</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}


DataPanel.title = 'Data Resource'
export default DataPanel;