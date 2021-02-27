import {Controller} from "components/useForm";
import Input from "components/input/Input";
import {Vertical} from "components/layout/Layout";
import {handleDragOver} from "module/page-builder/LayoutPanel";

export default function TextInputController({data,path, formController,setSelectedController}) {
    if(setSelectedController === undefined){
        debugger;
    }
    path = [...path,data.id];
    return <Vertical onDragOver={handleDragOver()} p={2} pT={1} pB={1} onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedController({...data,path});
    }}>
        <Controller render={Input} type={"input"} label={"Input"} controller={formController}
                    name={"input"} disabled={false}/>
    </Vertical>
}