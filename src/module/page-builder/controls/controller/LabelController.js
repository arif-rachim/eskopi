import {Horizontal, Vertical} from "components/layout/Layout";
import {handleDragOver} from "module/page-builder/page/PageEditorPanel";

export default function LabelController({data, path, formController, setSelectedController}) {
    path = [...path, data.id];
    return <Vertical onDragOver={handleDragOver()} p={2} pT={1}
                     pB={1}>
        <Horizontal onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (setSelectedController) {
                setSelectedController({...data, path});
            }
        }}>Label</Horizontal>
    </Vertical>
}