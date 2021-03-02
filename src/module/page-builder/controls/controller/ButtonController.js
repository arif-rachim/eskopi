import {Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import {handleDragOverControlComponent} from "module/page-builder/designer/handleDragOverControlComponent";

export default function ButtonController({data, formController, setSelectedController, ...controllerProps}) {
    return <Vertical onDragOver={handleDragOverControlComponent()} p={2} pT={1} pB={1}>
        <Button color={"primary"} onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (setSelectedController) {
                setSelectedController(data);
            }
        }} {...controllerProps}>Button</Button>
    </Vertical>
}