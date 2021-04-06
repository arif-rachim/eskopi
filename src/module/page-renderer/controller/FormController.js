import GroupController from "module/page-renderer/controller/GroupController";
import useForm from "components/useForm";
import useResource, {useResourceListener} from "components/useResource";
import {SYSTEM_TABLES} from "components/SystemTableName";
import useObserver, {useObserverValue} from "components/useObserver";
import useUser from "components/authentication/useUser";
import {useRegisteredControlsObserver} from "components/page/useControlRegistration";
import constructActionsObject from "module/page-renderer/controller/constructActionsObject";

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
    const $controls = useRegisteredControlsObserver();
    useResourceListener($onTableLoads, (status, tables) => {
        if (status === 'success') {
            const actions = constructActionsObject(reset, tables, token, $controls);
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
