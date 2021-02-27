import {Vertical} from "components/layout/Layout";
import {handleDragOver} from "module/page-builder/LayoutPanel";
import Button from "components/button/Button";
import {SelectedControlContext} from "module/page-builder/index";
import {useContext} from "react";

export default function ButtonController({data, formController}) {
    const [$controller, setController] = useContext(SelectedControlContext);
    return <Vertical onDragOver={handleDragOver()} p={2} pT={1} pB={1} onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setController(data);
    }}>
        <Button color={"primary"}>Button</Button>
    </Vertical>
}