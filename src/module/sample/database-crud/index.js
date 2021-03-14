import {Horizontal, Vertical} from "../../../components/layout/Layout";
import useForm, {Controller} from "../../../components/useForm";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";
import useSlideDownPanel from "../../../components/page/useSlideDownPanel";
import useObserver, {ObserverValue} from "../../../components/useObserver";
import useResource, {useResourceListener} from "../../../components/useResource";
import Select from "components/input/Select";

function DatabaseCrud() {
    const [$tableProps, setTableProps] = useObserver({});
    const {controller, handleSubmit, reset} = useForm();
    const detailForm = useForm();
    const showSlideDown = useSlideDownPanel();

    const [$createResource, actionCreateResource] = useResource();
    useResourceListener($createResource, (status, result) => {
        if (status === 'success') {
            reset({});
        }
    })
    const [$selectDataProvider] = useObserver(['string', 'number', 'date', 'boolean', 'array']);
    useSlideDownPanel()
    return <Vertical p={2} gap={2}>
        <Horizontal>
            <Button onClick={async () => {
                const result = await showSlideDown(({closePanel}) => {

                    return <Vertical p={2} gap={2}>
                        <form action="" onSubmit={detailForm.handleSubmit(data => {
                            closePanel(data.fieldName);
                        })}>
                            <Vertical gap={2}>
                                <Controller controller={detailForm.controller}
                                            name={'fieldName'} label={'Field Name'}
                                            render={Input} autoCaps={false}
                                />
                                <Controller controller={detailForm.controller}
                                            name={'fieldType'} label={'Field Type'}
                                            render={Select}
                                            $data={$selectDataProvider}
                                            dataKey={data => data}
                                            autoCaps={false}
                                />
                                <Horizontal hAlign={'right'}>
                                    <Button type={'submit'}>Save</Button>
                                </Horizontal>

                            </Vertical>
                        </form>
                    </Vertical>
                });
                setTableProps((existingProps) => {
                    return ({...existingProps, [result]: 'string'});
                });
            }}>Add Field</Button>
        </Horizontal>
        <form action="" onSubmit={handleSubmit(data => {
            const {table, ...dataToSave} = data;
            actionCreateResource('/db/' + table, dataToSave);
        })}>
            <Vertical gap={2}>
                <Controller controller={controller} render={Input} label={'Table Name'} name={'table'}/>
                <ObserverValue $observers={$tableProps}>
                    {(props) => {
                        const propsArray = Object.keys(props);
                        return <Vertical gap={4}>
                            {propsArray.map(key => {
                                return <Controller controller={controller} render={Input} label={key} name={key}
                                                   key={key}/>
                            })}
                        </Vertical>
                    }}
                </ObserverValue>
                <Horizontal>
                    <Button type={'submit'}>Save</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}

DatabaseCrud.title = 'Database Crud';
export default DatabaseCrud;