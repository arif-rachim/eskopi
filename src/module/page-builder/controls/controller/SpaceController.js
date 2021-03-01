import {Horizontal, Vertical} from "components/layout/Layout";
import {ControlMapper, handleDragOver} from "module/page-builder/page/PageEditorPanel";
import {getPlaceHolder} from "module/page-builder/page/getPlaceHolder";
import {useState} from "react";
import {useObserverListener} from "components/useObserver";
import {isNullOrUndefined} from "components/utils";

export default function SpaceController({
                                            data,
                                            path,
                                            formController,
                                            $selectedController,
                                            setSelectedController,
                                            ...controllerProps
                                        }) {
    const {id, layout, children, type, ...props} = data;
    path = [...path, id];
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
        onDragOver={handleDragOver()}
        p={0}
        m={0}
        style={{
            minHeight: 30,
            border: isHovered ? '1px dashed #ccc' : '1px dashed rgba(0,0,0,0)',
            transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)',
            flexWrap: 'wrap',
            backgroundColor: isFocused ? 'rgba(152,224,173,0.5)' : children && children.length > 0 ? 'inherit' : 'rgba(0,0,0,0.1)'
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
        onDragOver={() => setHovered(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-layout={isHorizontal ? 'horizontal' : 'vertical'}
        onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setSelectedController({...data, path});
        }}
        {...controllerProps}
        {...props}
    >
        {children && children.map(child => {
            const ChildRender = ControlMapper[child.type];
            return <ChildRender key={child.id}
                                data={child}
                                path={path}
                                formController={formController}
                                $selectedController={$selectedController}
                                setSelectedController={setSelectedController}
                                draggable={true}/>
        })}
    </Component>
}