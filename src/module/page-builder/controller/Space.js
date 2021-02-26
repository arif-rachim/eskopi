import {Horizontal, Vertical} from "../../../components/layout/Layout";
import {useContext} from "react";
import {getPlaceHolder, handleDragOver, renderChild} from "../LayoutPanel";
import {SelectedControlContext} from "../index";

export default function Space({data, controller}) {
    const isHorizontal = !!data.isHorizontal;
    const Component = isHorizontal ? Horizontal : Vertical;
    const [$controller,setController] = useContext(SelectedControlContext);
    return <Component
        onDragOver={handleDragOver()}
        p={2}
        m={2}
        style={{minHeight: 30}}
        brightness={-2}
        color={"light"}
        data-id={data.id}
        onDragEnter={(event) => {
            const placeHolder = getPlaceHolder({display: 'block'});
            event.preventDefault();
            event.stopPropagation();
            if (placeHolder.parentElement !== event.currentTarget) {
                event.currentTarget.append(placeHolder);
            }
        }}
        data-layout={isHorizontal ? 'horizontal' : 'vertical'}
        onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setController(data);
        }}
    >{data.children && data.children.map(child => renderChild(child, controller))}</Component>
}