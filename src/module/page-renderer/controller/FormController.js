import GroupController from "module/page-renderer/controller/GroupController";
import useForm from "components/useForm";
import useResource, {post, useResourceListener} from "components/useResource";
import {SYSTEM_TABLES} from "components/SystemTableName";
import useObserver, {useObserverValue} from "components/useObserver";
import useUser from "components/authentication/useUser";

export default function FormController({
                                           data,
                                           control: formControl,
                                           style,
                                           containerProps,
                                           ...controllerProps
                                       }) {
    const {handleSubmit: onHandleSubmit, handleLoad: onHandleLoad, ...dataProps} = data;
    const {control, handleSubmit, reset} = useForm();
    const [$onTableLoads] = useResource({url: `/db/${SYSTEM_TABLES}`});
    const [$actions, setActions] = useObserver();
    const [$user] = useUser();
    const token = useObserverValue($user)?.token;
    useResourceListener($onTableLoads, (status, tables) => {
        if (status === 'success') {
            const actions = {resetForm: reset};
            for (const table of tables) {
                const doSave = `doSave${table.tableName}`;
                const doDelete = `doDelete${table.tableName}`;
                const doRead = `doRead${table.tableName}`;
                actions[doSave] = async (data) => {
                    return post(`/db/${table.id_}`, ({...data, a: 'c'}), token);
                }
                actions[doDelete] = async (id) => {
                    return post(`/db/${table.id_}`, ({id_: id, a: 'd'}), token);
                }
                actions[doRead] = async (data) => {
                    return post(`/db/${table.id_}`, ({...data, a: 'r'}), token);
                }
            }
            setActions(actions);
        }
    })

    return <GroupController data={dataProps}
                            control={control}
                            style={style}
                            element={'form'}
                            onSubmit={handleSubmit(data => {
                                const f = new Function('data', 'actions', `(async(data,actions) => {
${onHandleSubmit}
})(data,actions)`);
                                f.call({}, data, $actions.current);
                            })}
                            containerProps={containerProps}
                            {...controllerProps}
    />
}
