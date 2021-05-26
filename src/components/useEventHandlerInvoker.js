import {PageControlContext} from "components/page/Page";
import {useCallback, useContext} from "react";
import useObserver, {useObserverListener, useObserverValue} from "components/useObserver";
import constructActionsObject from "module/page-renderer/controller/constructActionsObject";
import useUser from "components/authentication/useUser";
import {useRegisteredControlsObserver} from "components/page/useControlRegistration";

export default function useEventHandlerInvoker({control: formControl, handleSubmit, reset: formReset} = {}) {
    const {$systemTables, reset: pageReset, control: pageControl} = useContext(PageControlContext);
    const [$user] = useUser();
    const token = useObserverValue($user)?.token;
    const $controls = useRegisteredControlsObserver();
    // maybe in future we can rename this to formControl or pageControl
    const control = formControl ? formControl : pageControl;
    const reset = formReset ? formReset : pageReset;

    const [$actions, setActions] = useObserver(() => {
        return constructActionsObject(reset, $systemTables.current, token, $controls.current);
    });
    useObserverListener([$systemTables, $controls], ([tables, controls]) => {
        const actions = constructActionsObject(reset, tables, token, controls);
        setActions(actions);
    });
    return useCallback(function eventHandlerInvoker(handler) {
        const f = new Function('data', 'actions', `(async function eventInvoker(data,actions){${handler}})(data,actions)`);
        return f.call({}, control?.current?.$value?.current, $actions?.current);
    }, [$actions, control])
}