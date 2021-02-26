import {Vertical} from "../../components/layout/Layout";
import {SelectedControlContext} from "./index";
import {useContext} from "react";
import {ObserverValue} from "../../components/useObserver";

export default function ControllerPropertiesPanel(){
    const [$controller,setSelectedController] = useContext(SelectedControlContext);
    return <Vertical color={'light'} brightness={1} height={'100%'}>

        <ObserverValue $observer={$controller} render={({value}) => {
            return <Vertical>
                {JSON.stringify(value)}
            </Vertical>
        }} />
    </Vertical>
}