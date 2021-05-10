import {Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import useObserver, {useObserverListener, useObserverValue} from "components/useObserver";
import constructActionsObject from "module/page-renderer/controller/constructActionsObject";
import {PageControlContext} from "components/page/Page";
import {useContext} from "react";
import useUser from "components/authentication/useUser";
import {useRegisteredControlsObserver} from "components/page/useControlRegistration";

export default function ButtonController({
                                             data,
                                             control,
                                             style,
                                             containerProps,
                                             ...controllerProps
                                         }) {
    const {handleClick: onHandleClick} = data;

    const {$systemTables, reset, control: formControl} = useContext(PageControlContext);
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

    return <Vertical p={2} pT={1} pB={1} {...containerProps}>
        <Button color={"primary"} style={style} {...controllerProps} type={data.buttonType}
                onClick={() => {
                    const f = new Function('data', 'actions', `(async(data,actions) => {${onHandleClick}})(data,actions)`);
                    f.call({}, formControl?.current?.$value?.current, $actions?.current);
                }}
        >{data.label || 'Button'}</Button>
    </Vertical>
}