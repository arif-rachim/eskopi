import {Vertical} from "components/layout/Layout";
import {memo, useContext, useRef, useState} from "react";
import {DropListenerContext} from "module/page-builder/index";
import {ObserverValue, useObserverMapper} from "components/useObserver";
import useForm from "components/useForm";
import {getPlaceHolder, usePlaceHolderListener} from "module/page-builder/designer/getPlaceHolder";
import {handlePlaceHolderDrop} from "module/page-builder/designer/handlePlaceHolderDrop";
import {ControlMapper} from "module/page-builder/controls/ControllerMapper";


const handleRootDragEnter = (dragHoverCountRef) => (event) => {
    const placeHolder = getPlaceHolder({display: 'block'});
    dragHoverCountRef.current++;
    if (dragHoverCountRef.current <= 0) {
        return;
    }
    // activating placeholder
    if (placeHolder.parentElement !== event.currentTarget) {
        event.currentTarget.append(placeHolder);
    }
}
const handleRootDragLeave = (dragHoverCountRef) => () => {
    dragHoverCountRef.current--;
}
const handleRootDrop = (dragHoverCountRef, dropListener) => (event) => {
    getPlaceHolder({display: 'none'});
    event.preventDefault();
    event.stopPropagation();
    dragHoverCountRef.current = 0;
    dropListener.current.call();
}
const handleRootDragOver = () => (event) => {
    event.preventDefault();
    event.stopPropagation();
}


export default function DesignerPanel({$data, setData, $selectedController, setSelectedController}) {
    const rootRef = useRef();
    const dropListener = useContext(DropListenerContext);
    usePlaceHolderListener("drop", handlePlaceHolderDrop(rootRef, setData));
    const dragHoverCountRef = useRef(0);
    const {controller} = useForm();
    return <Vertical color={"light"} brightness={-3} p={3} flex={1}>
        <Vertical domRef={rootRef} color={"light"} brightness={0} flex={1} elevation={1}
                  onDragEnter={handleRootDragEnter(dragHoverCountRef)}
                  onDragOver={handleRootDragOver()}
                  onDragLeave={handleRootDragLeave(dragHoverCountRef)}
                  onDrop={handleRootDrop(dragHoverCountRef, dropListener)} p={2}
                  onClick={() => setSelectedController(null)}
                  data-layout={'vertical'}>

            <ObserverValue $observer={useObserverMapper($data, data => data.children)}
                           render={RenderLayoutMemo}
                           controller={controller}
                           $selectedController={$selectedController}
                           setSelectedController={setSelectedController}/>
        </Vertical>
    </Vertical>
}


export const RenderLayout = ({value, controller, $selectedController, setSelectedController}) => {
    if (value === undefined) {
        return false;
    }

    return value.map(child => {
        const ChildRender = ControlMapper[child.type];
        return <DraggableComponent render={ChildRender} key={child.id}
                                   data={child}
                                   formController={controller}
                                   $selectedController={$selectedController}
                                   setSelectedController={setSelectedController}
        />
    });
}
const RenderLayoutMemo = memo(RenderLayout);

function DraggableComponent({render, data, ...props}) {
    const Render = render;
    const [isDragging, setIsDragging] = useState();
    const dropListener = useContext(DropListenerContext);
    const handleOnDragStart = (event) => {
        event.stopPropagation();
        setIsDragging(true);
        console.log("Shit we start dragging", data);
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        dropListener.current = () => {
            setIsDragging(false);
        };
    };
    return <Render draggable={true} opacity={isDragging ? 0.5 : 1} onDragStart={handleOnDragStart}
                   data={data} {...props}/>
}