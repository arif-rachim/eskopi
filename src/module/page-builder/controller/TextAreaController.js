import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import {handleDragOver} from "module/page-builder/LayoutPanel";
import TextArea from "components/input/TextArea";


export default function TextAreaController({data,path, formController,setSelectedController}) {
    path = [...path,data.id];
    return <Vertical onDragOver={handleDragOver()} p={2} pT={1} pB={1} onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedController({...data,path});
    }}>
        <Controller render={TextArea} rows={3} label={"Text Area"} controller={formController}
                    name={"textarea"} disabled={false}/>
    </Vertical>
}