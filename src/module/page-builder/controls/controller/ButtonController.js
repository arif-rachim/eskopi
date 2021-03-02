import {Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import {handleDragOverControlComponent} from "module/page-builder/page/handleDragOverControlComponent";

export default function ButtonController({data, path, formController, setSelectedController, ...controllerProps}) {
    path = [...path, data.id];
    return <Vertical onDragOver={handleDragOverControlComponent()} p={2} pT={1} pB={1}>
        <Button color={"primary"} onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (setSelectedController) {
                setSelectedController({...data, path});
            }
        }} {...controllerProps}>Button</Button>
    </Vertical>
}