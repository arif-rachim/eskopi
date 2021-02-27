import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import {handleDragOver} from "module/page-builder/LayoutPanel";
import TextArea from "components/input/TextArea";
import {SelectedControlContext} from "module/page-builder/index";
import {useContext} from "react";


export default function TextAreaController({data, formController}) {
    const [$controller, setController] = useContext(SelectedControlContext);
    return <Vertical onDragOver={handleDragOver()} p={2} pT={1} pB={1} onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setController(data);
    }}>
        <Controller render={TextArea} rows={3} label={"Text Area"} controller={formController}
                    name={"textarea"} disabled={false}/>
    </Vertical>
}