import {Horizontal, Vertical} from "components/layout/Layout";
import {handleDragOverControlComponent} from "module/page-builder/designer/handleDragOverControlComponent";

export default function LabelController({
                                            data,
                                            formControl,
                                            $selectedController,
                                            setSelectedController,
                                            ...controllerProps
                                        }) {

    return <Vertical onDragOver={handleDragOverControlComponent()} p={2} pT={1}
                     pB={1}>
        <Horizontal onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (setSelectedController) {
                setSelectedController(data);
            }
        }} {...controllerProps}>Label</Horizontal>
    </Vertical>
}