import {PageControlContext} from "components/page/Page";
import {useCallback, useContext} from "react";
import useObserver, {useObserverListener, useObserverValue} from "components/useObserver";
import constructActionsObject from "module/page-renderer/controller/constructActionsObject";
import useUser from "components/authentication/useUser";
import {useRegisteredControlsObserver} from "components/page/useControlRegistration";

export default function useEventHandlerInvoker() {
    const {$systemTables} = useContext(PageControlContext);
    const [$user] = useUser();
    const token = useObserverValue($user)?.token;
    const $controls = useRegisteredControlsObserver();
    // maybe in future we can rename this to formControl or pageControl

    const [$actions, setActions] = useObserver(() => {
        return constructActionsObject($systemTables.current, token, $controls.current);
    });

    useObserverListener([$systemTables, $controls], ([tables, controls]) => {
        const actions = constructActionsObject(tables, token, controls);
        setActions(actions);
    });

    return useCallback(function eventHandlerInvoker(handler) {
        const f = new Function('actions', `(async function eventInvoker(actions){${handler}})(actions)`);
        return f.call({}, $actions?.current);
    }, [$actions])
}