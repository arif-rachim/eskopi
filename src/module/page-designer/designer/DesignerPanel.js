import {Horizontal, Vertical} from "components/layout/Layout";
import {memo, useContext, useRef, useState} from "react";
import {DropListenerContext} from "module/page-designer/index";
import {ObserverValue, useObserverListener, useObserverMapper} from "components/useObserver";
import useForm from "components/useForm";
import {getPlaceHolder, usePlaceHolderListener} from "module/page-designer/designer/getPlaceHolder";
import {handlePlaceHolderDrop} from "module/page-designer/designer/handlePlaceHolderDrop";
import {ControlForPageDesigner} from "module/page-designer/controls/ControllerMapper";
import getOutlinePlaceHolder from "module/page-designer/outline/getOutlinePlaceHolder";
import useResource, {useResourceListener} from "components/useResource";
import Button from "components/button/Button";
import {isNullOrUndefined} from "components/utils";
import {useInfoMessage} from "components/dialog/Dialog";
import {SYSTEM_PAGE_DESIGNS} from "components/SystemTableName";
import {ControlRegistrationContextProvider} from "components/page/useControlRegistration";
import {PageActions} from "components/page/Page";
import usePageContext from "components/page/usePageContext";


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
    const {control, handleSubmit, reset} = useForm();

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
    });
    const [, setPageContext] = usePageContext();
    return <>
        <Vertical color={"light"} brightness={-3} p={3} flex={1}
                  $visible={useObserverMapper($hasSelectedPage, value => !value)} vAlign={'center'} hAlign={'center'}>
            Please chose a page
        </Vertical>
        <Vertical color={"light"} height={'100%'} brightness={-3} flex={1} $visible={$hasSelectedPage}
                  overflow={'auto'}>
            <Vertical height={'100%'}>
                <Vertical domRef={rootRef} color={"light"} brightness={0} elevation={1}
                          onDragEnter={handleRootDragEnter(dragHoverCountRef)}
                          onDragOver={handleRootDragOver()}
                          onDragLeave={handleRootDragLeave(dragHoverCountRef)}
                          onDrop={handleRootDrop(dragHoverCountRef, dropListener)} p={2}
                          onClick={() => setSelectedController(null)}
                          data-layout={'vertical'}
                          height={'calc(100% - 32px)'}
                          overflow={"auto"}>
                    <ObserverValue $observers={useObserverMapper($data, data => {
                        return data.children
                    })}>{
                        (value) => {
                            return <ControlRegistrationContextProvider key={JSON.stringify(value)}
                                                                       onChange={(controls) => setPageContext(({controls}))}>
                                <PageActions>
                                    <RenderLayoutMemo value={value} control={control}
                                                      setSelectedController={setSelectedController}
                                                      $selectedController={$selectedController}/>
                                </PageActions>
                            </ControlRegistrationContextProvider>
                        }
                    }</ObserverValue>

                </Vertical>
                <Horizontal hAlign={'right'} gap={2} color={"light"} p={2} brightness={0.5}>
                    <Button type={'submit'} onClick={handleSubmit(() => {
                        const data = $data.current;
                        data.pageId = $selectedPage.current.id;
                        data.a = data.id_ ? 'u' : 'c';
                        doSavePage(`/db/${SYSTEM_PAGE_DESIGNS}`, data);
                    })}>Save</Button>
                    <Button type={"button"} onClick={() => {
                        reset()
                    }}>Cancel</Button>
                </Horizontal>
            </Vertical>
        </Vertical>
    </>
}


export const RenderLayout = ({value, control, $selectedController, setSelectedController}) => {
    if (value === undefined) {
        return false;
    }
    return value.map(child => {
        const ChildRender = ControlForPageDesigner[child.type];
        return <DraggableComponent render={ChildRender} key={child.id}
                                   data={child}
                                   control={control}
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