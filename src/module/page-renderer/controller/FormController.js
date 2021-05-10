import GroupController from "module/page-renderer/controller/GroupController";
import useForm from "components/useForm";
import useObserver, {useObserverListener, useObserverValue} from "components/useObserver";
import useUser from "components/authentication/useUser";
import {useRegisteredControlsObserver} from "components/page/useControlRegistration";
import constructActionsObject from "module/page-renderer/controller/constructActionsObject";
import {PageControlContext} from "components/page/Page";
import {useContext} from "react";

export default function FormController({
                                           data,
                                           control: formControl,
                                           style,
                                           containerProps,
                                           ...controllerProps
                                       }) {
    const {handleSubmit: onHandleSubmit, handleLoad: onHandleLoad, ...dataProps} = data;
    const {control, handleSubmit, reset} = useForm();
    const {$systemTables} = useContext(PageControlContext);
    const [$user] = useUser();
    const token = useObserverValue($user)?.token;
    const $controls = useRegisteredControlsObserver();
    const [$actions, setActions] = useObserver(() => {
        return constructActionsObject(reset, $systemTables.current, token, $controls.current);
    });
    useObserverListener([$systemTables, $controls], ([tables, controls]) => {
        const actions = constructActionsObject(reset, tables, token, controls);
        setActions(actions);
    });
    return <GroupController data={dataProps}
                            control={control}
                            style={style}
                            element={'form'}
                            onSubmit={handleSubmit(data => {
                                // eslint-disable-next-line
                                const f = new Function('data', 'actions', `(async(data,actions) => {${onHandleSubmit}})(data,actions)`);
                                f.call({}, data, $actions.current);
                            })}
                            containerProps={containerProps}
                            {...controllerProps}
    />
}
