import {Horizontal, Vertical} from "components/layout/Layout";
import {handleDragOverControlComponent} from "module/page-builder/designer/handleDragOverControlComponent";

export default function LabelController({data, path, formController, setSelectedController, ...controllerProps}) {
    path = [...path, data.id];
    return <Vertical onDragOver={handleDragOverControlComponent()} p={2} pT={1}
                     pB={1}>
        <Horizontal onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (setSelectedController) {
                setSelectedController({...data, path});
            }
        }} {...controllerProps}>Label</Horizontal>
    </Vertical>
}