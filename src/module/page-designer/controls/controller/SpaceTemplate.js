import {Horizontal, Vertical} from "components/layout/Layout";
import {RenderLayout} from "module/page-designer/designer/DesignerPanel";
import {getPlaceHolder} from "module/page-designer/designer/getPlaceHolder";
import {useState} from "react";
import {useObserverListener} from "components/useObserver";
import {isNullOrUndefined} from "components/utils";
import {handleDragOverControlComponent} from "module/page-designer/designer/handleDragOverControlComponent";

export default function SpaceTemplate({
                                          data,
                                          formControl,
                                          $selectedController,
                                          setSelectedController,
                                          ...controllerProps
                                      }) {
    const {id, layout, children, type, parentIds, ...props} = data;
    const isHorizontal = layout === 'horizontal';
    const Component = isHorizontal ? Horizontal : Vertical;
    const [isHovered, setHovered] = useState(false);
    const [isFocused, setFocused] = useState(false);
    useObserverListener($selectedController, selectedController => {
        if (isNullOrUndefined(selectedController)) {
            return setFocused(false);
        }
        setFocused(selectedController.id === id);
    });

    return <Component
        onDragOver={() => {
            setHovered(true);
            handleDragOverControlComponent()
        }}
        p={0}
        m={0}
        style={{
            minHeight: 30,
            border: isFocused ? '1px solid blue' : isHovered ? '1px solid green' : (!children || children.length === 0) ? '1px dashed #ccc' : '1px solid rgba(0,0,0,0)',
            transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)',
            flexWrap: 'wrap'
        }}
        data-id={id}
        onDragEnter={(event) => {
            const placeHolder = getPlaceHolder({display: 'block'});
            event.preventDefault();
            event.stopPropagation();
            if (placeHolder.parentElement !== event.currentTarget) {
                event.currentTarget.append(placeHolder);
            }
        }}

        onMouseEnter={(event) => {
            event.stopPropagation();
            event.preventDefault();
            setHovered(true);
        }}
        onMouseLeave={(event) => {
            event.stopPropagation();
            event.preventDefault();
            setHovered(false);
        }}
        data-layout={isHorizontal ? 'horizontal' : 'vertical'}
        onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setSelectedController(data);
        }}
        {...controllerProps}
        {...props}
    >
        <RenderLayout value={children} control={formControl}
                      $selectedController={$selectedController}
                      setSelectedController={setSelectedController}/>

    </Component>
}
