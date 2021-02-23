import {Vertical} from "components/layout/Layout";
import {memo, useContext, useEffect, useMemo, useRef, useState} from "react";
import {DropListenerContext} from "module/page-builder/index";
import useObserver, {ObserverValue, useObserverMapper} from "components/useObserver";
import {v4 as uuid} from "uuid";
import {Controls} from "module/page-builder/ControlPanel";
import Input from "components/input/Input";
import useForm, {Controller} from "components/useForm";
import TextArea from "components/input/TextArea";
import Button from "components/button/Button";

function usePlaceHolder() {
    const placeHolder = useMemo(() => {
        const placeHolder = document.createElement('div');
        placeHolder.setAttribute('style', 'border:1px solid #666;width:100%;height:30px;box-sizing:border-box;');
        return placeHolder;
    }, []);
    return placeHolder;
}

/**
 *
 * @param {placeHolder} placeHolder
 * @param {'dragover','dragleave','dragenter','drag','drop','dragend','dragexit'} event
 * @param {function(event)} listener
 */
function usePlaceHolderListener(placeHolder, event, listener) {
    useEffect(() => {
        placeHolder.addEventListener(event, listener);
        return () => {
            placeHolder.removeEventListener(event, listener);
        }
    }, [event, listener, placeHolder]);
}

export default function LayoutPanel({data = {}}) {
    const [isDragOver, setIsDragOver] = useState();
    const placeHolder = usePlaceHolder();
    const dropListener = useContext(DropListenerContext);
    const [$data, setData] = useObserver(data);
    usePlaceHolderListener(placeHolder, "drop", (event) => {
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        // we need to know the parent first
        const childIndex = Array.prototype.indexOf.call(placeHolder.parentElement.children, placeHolder);
        if (placeHolder.parentElement === rootRef.current) {
            setData(oldData => {
                const newData = {...oldData};
                newData.children = newData.children || [];

                newData.children.splice(childIndex, 0, {
                    id: uuid(),
                    ...data,
                });
                newData.children = [...newData.children];
                return newData;
            });
        }

    });
    const dragHoverCountRef = useRef(0);
    const handleDragEnter = (event) => {
        dragHoverCountRef.current++;
        if (dragHoverCountRef.current <= 0) {
            return;
        }
        setIsDragOver(true);
        // activating placeholder
        event.currentTarget.append(placeHolder);
    }
    const handleDragLeave = () => {
        dragHoverCountRef.current--;
        if (dragHoverCountRef.current > 0) {
            return;
        }
        setIsDragOver(false);
    }
    const handleDrop = (event) => {
        setIsDragOver(false);
        event.preventDefault();
        event.stopPropagation();
        dragHoverCountRef.current = 0;
        dropListener.current.call();
        placeHolder.remove();
    }
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }
    const rootRef = useRef();
    const {controller} = useForm();
    return <Vertical color={"light"} brightness={-3} p={3} flex={1}>
        <Vertical domRef={rootRef} color={"light"} brightness={isDragOver ? -1 : 0} flex={1} elevation={1}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop} p={2}>
            <ObserverValue $observer={useObserverMapper($data, data => data.children)} render={RenderLayout}
                           controller={controller}/>
        </Vertical>
    </Vertical>
}

const RenderLayout = memo(({value, controller}) => {
    if (value === undefined) {
        return false;
    }
    return value.map(child => {
        switch (child.type) {
            case Controls.LABEL : {
                return <Vertical key={child.id}>Label</Vertical>
            }
            case Controls.TEXT : {
                return <Controller key={child.id} render={Input} type={"input"} label={"Input"} controller={controller}
                                   name={"input"} disabled={false}/>
            }
            case Controls.TEXT_AREA : {
                return <Controller key={child.id} render={TextArea} rows={3} label={"Text Area"} controller={controller}
                                   name={"textarea"} disabled={false}/>
            }
            case Controls.BUTTON : {
                return <Button key={child.id} color={"primary"}>Button</Button>
            }
            default : {
                return <Vertical/>
            }
        }
    })
});