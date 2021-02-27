import {Vertical} from "components/layout/Layout";
import {handleDragOver} from "module/page-builder/LayoutPanel";
import Button from "components/button/Button";

export default function ButtonController({data,path, formController,setSelectedController}) {
    path = [...path,data.id];
    return <Vertical onDragOver={handleDragOver()} p={2} pT={1} pB={1} onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedController({...data,path});
    }}>
        <Button color={"primary"}>Button</Button>
    </Vertical>
}