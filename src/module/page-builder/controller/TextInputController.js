import {Controller} from "components/useForm";
import Input from "components/input/Input";
import {Vertical} from "components/layout/Layout";
import {handleDragOver} from "module/page-builder/LayoutPanel";
import {SelectedControlContext} from "module/page-builder/index";
import {useContext} from "react";

export default function TextInputController({data, formController}) {
    const [$controller, setController] = useContext(SelectedControlContext);
    return <Vertical onDragOver={handleDragOver()} p={2} pT={1} pB={1} onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setController(data);
    }}>
        <Controller render={Input} type={"input"} label={"Input"} controller={formController}
                    name={"input"} disabled={false}/>
    </Vertical>
}