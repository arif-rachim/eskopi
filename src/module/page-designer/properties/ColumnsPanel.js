import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import InputWithSlideDownDetail from "components/input/InputWithSlideDownDetail";
import Button from "components/button/Button";
import InputTable from "components/table/InputTable";
import {useConfirmMessage} from "components/dialog/Dialog";
import {v4 as uuid} from "uuid";
import useObserver from "components/useObserver";

function ColumnsPanel({control}) {
    return <Vertical p={2} gap={2}>
        <Controller name={'columns'}
                    control={control}
                    render={InputWithSlideDownDetail}
                    title={'Columns'}
                    detailPanel={DetailPanel}
        />
    </Vertical>
}

function DetailPanel({closePanel, $formValue}) {
    const {handleSubmit, control} = useForm();
    const showConfirmation = useConfirmMessage();
    // here we need to get the list of the column
    const [$columns] = useObserver({
        name: {
            title: 'Name'
        },
        column: {
            title: 'Column'
        },
        remove: {
            title: ''
        }
    })
    return <Vertical gap={2} p={2} width={520}>
        <Horizontal style={{fontSize: 22}} hAlign={'center'}>Data Resource</Horizontal>
        <form action="" onSubmit={handleSubmit(data => {
            closePanel(data);
        })}>
            <Vertical>
                <Horizontal pT={4} pB={2} hAlign={'right'}>
                    <Button type={'button'} onClick={() => {
                        control.current.onChange.columns(oldField => {
                            oldField = oldField || [];
                            return [...oldField, {id: uuid(), name: '', columnName: ''}]
                        })
                    }}>Add Column</Button>
                </Horizontal>
                <Controller render={InputTable}
                            name={'columns'}
                            control={control}
                            $columns={$columns}
                />
                <Horizontal hAlign={'right'} gap={2} pT={2}>
                    <Button type={'button'} onClick={async () => {
                        const result = await showConfirmation('Are you sure you want to remove this Columns link ?')
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


ColumnsPanel.title = 'Columns'
export default ColumnsPanel;