import useObserver, {useObserverListener, useObserverValue} from "components/useObserver";
import {useRegisteredControlsObserver} from "components/page/useControlRegistration";
import constructActionsObject from "module/page-renderer/controller/constructActionsObject";
import useUser from "components/authentication/useUser";
import {PageControlContext} from "components/page/Page";
import {useContext} from "react";

export default function withChangeHandler(Component) {
    return function WithChangeHandler(props) {
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
        const {handleChange, ...restData} = props.data;
        const {onChange, ...restProps} = props;
        restProps.data = restData;
        return <Component onChange={(value) => {
            if (onChange) {
                onChange(value)
            }
            const f = new Function('data', 'actions', `(async(data,actions) => {${handleChange}})(data,actions)`);
            f.call({}, formControl?.current?.$value?.current, $actions?.current);
        }} {...restProps}/>
    }
}