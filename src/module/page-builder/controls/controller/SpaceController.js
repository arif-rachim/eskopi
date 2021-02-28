import {Horizontal, Vertical} from "components/layout/Layout";
import {handleDragOver, renderChild} from "module/page-builder/page/PageEditorPanel";
import {getPlaceHolder} from "module/page-builder/page/getPlaceHolder";

export default function SpaceController({data, path, formController, setSelectedController}) {
    const isHorizontal = data.layout === 'horizontal';
    const Component = isHorizontal ? Horizontal : Vertical;
    path = [...path, data.id];
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
            setSelectedController({...data, path});
        }}
    >{data.children && data.children.map(child => renderChild(path, child, formController, setSelectedController))}</Component>
}