import {Horizontal, Vertical} from "components/layout/Layout";
import {memo, useContext, useRef, useState} from "react";
import {DropListenerContext} from "module/page-builder/index";
import {ObserverValue, useObserverListener, useObserverMapper} from "components/useObserver";
import useForm from "components/useForm";
import {getPlaceHolder, usePlaceHolderListener} from "module/page-builder/designer/getPlaceHolder";
import {handlePlaceHolderDrop} from "module/page-builder/designer/handlePlaceHolderDrop";
import {ControlMapper} from "module/page-builder/controls/ControllerMapper";
import getOutlinePlaceHolder from "module/page-builder/outline/getOutlinePlaceHolder";
import useResource, {useResourceListener} from "components/useResource";
import Button from "components/button/Button";
import {isNullOrUndefined} from "components/utils";
import {useInfoMessage} from "components/dialog/Dialog";
import {SYSTEM_PAGE_DESIGNS} from "components/SystemTableName";


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
    getOutlinePlaceHolder({display: 'none'});
    event.preventDefault();
    event.stopPropagation();
    dragHoverCountRef.current = 0;
    dropListener.current.call();
}
const handleRootDragOver = () => (event) => {
    event.preventDefault();
    event.stopPropagation();
}


export default function DesignerPanel({$data, setData, $selectedPage, $selectedController, setSelectedController}) {
    const rootRef = useRef();
    const dropListener = useContext(DropListenerContext);
    usePlaceHolderListener("drop", handlePlaceHolderDrop(rootRef, setData));
    const dragHoverCountRef = useRef(0);
    const {control, handleSubmit} = useForm();
    const [$onPageDataSave, doSavePage] = useResource();
    const [$onPageDetailFetched, doLoadDetail] = useResource();
    const $hasSelectedPage = useObserverMapper($selectedPage, selectedPage => !isNullOrUndefined(selectedPage))
    const showInfo = useInfoMessage();
    useResourceListener($onPageDataSave, async (status, result) => {
        if (status === 'success') {
            await showInfo();
        }
    });
    useObserverListener($selectedPage, selectedPage => {
        doLoadDetail(`/db/${SYSTEM_PAGE_DESIGNS}`, {a: 'r', pageId: $selectedPage.current.id});
    });
    useResourceListener($onPageDetailFetched, (status, result) => {
        if (status === 'success') {
            if (result.length > 0) {
                setData(result[0]);
            } else {
                setData({});
            }

        }
    })
    return <>
        <Vertical color={"light"} brightness={-3} p={3} flex={1}
                  $visible={useObserverMapper($hasSelectedPage, value => !value)} vAlign={'center'} hAlign={'center'}>
            Please chose a page
        </Vertical>
        <Vertical color={"light"} brightness={-3} p={3} flex={1} $visible={$hasSelectedPage}>
            <form action="" onSubmit={handleSubmit(() => {
                const data = $data.current;
                data.pageId = $selectedPage.current.id;
                data.a = data.id_ ? 'u' : 'c';
                doSavePage(`/db/${SYSTEM_PAGE_DESIGNS}`, data);
            })} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <Vertical domRef={rootRef} color={"light"} brightness={0} elevation={1}
                          onDragEnter={handleRootDragEnter(dragHoverCountRef)}
                          onDragOver={handleRootDragOver()}
                          onDragLeave={handleRootDragLeave(dragHoverCountRef)}
                          onDrop={handleRootDrop(dragHoverCountRef, dropListener)} p={2}
                          onClick={() => setSelectedController(null)}
                          data-layout={'vertical'} style={{height: 'calc(100% - 55px)'}} mB={2}>

                    <ObserverValue $observers={useObserverMapper($data, data => {
                        return data.children
                    })}>{
                        (value) => {
                            return <RenderLayoutMemo value={value} control={control}
                                                     setSelectedController={setSelectedController}
                                                     $selectedController={$selectedController}/>
                        }
                    }</ObserverValue>

                </Vertical>
                <Horizontal hAlign={'right'} gap={2}>
                    <Button>Save</Button>
                    <Button>Cancel</Button>
                </Horizontal>
            </form>
        </Vertical>
    </>
}


export const RenderLayout = ({value, control, $selectedController, setSelectedController}) => {
    if (value === undefined) {
        return false;
    }
    return value.map(child => {
        const ChildRender = ControlMapper[child.type];
        return <DraggableComponent render={ChildRender} key={child.id}
                                   data={child}
                                   formControl={control}
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
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        dropListener.current = () => {
            setIsDragging(false);
            getOutlinePlaceHolder({display: 'none'});
            getPlaceHolder({display: 'none'});
        };
    };
    return <Render draggable={true} opacity={isDragging ? 0.5 : 1} onDragStart={handleOnDragStart}
                   data={data} {...props}/>
}