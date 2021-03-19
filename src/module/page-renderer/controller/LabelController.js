import {Horizontal, Vertical} from "components/layout/Layout";
import {handleDragOverControlComponent} from "module/page-builder/designer/handleDragOverControlComponent";

export default function LabelController({
                                            data,
                                            control,
                                            ...controllerProps
                                        }) {
    return <Vertical onDragOver={handleDragOverControlComponent()} p={2} pT={1}
                     pB={1}>
        <Horizontal {...controllerProps}>Label</Horizontal>
    </Vertical>
}