import {Horizontal, Vertical} from "components/layout/Layout";
import {memo, useContext, useEffect, useRef, useState} from "react";
import {DropListenerContext} from "module/page-builder/index";
import useObserver, {ObserverValue, useObserverMapper} from "components/useObserver";
import {v4 as uuid} from "uuid";
import {Controls} from "module/page-builder/ControlPanel";
import Input from "components/input/Input";
import useForm, {Controller} from "components/useForm";
import TextArea from "components/input/TextArea";
import Button from "components/button/Button";

let placeHolder = (() => {
    const element = document.createElement('div');
    element.setAttribute('style', 'border:1px solid #666;width:100%;height:30px;box-sizing:border-box;');
    element.setAttribute('id', 'my-element');
    document.body.appendChild(element);
    return document.getElementById('my-element');
})();


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

function traceParentId(parentElement, root) {
    const dataId = parentElement.getAttribute('data-id');
    if (parentElement.parentElement !== root) {
        const newResult = traceParentId(parentElement.parentElement, root);
        return [...newResult, dataId];
    } else {
        return [dataId];
    }
}

export default function LayoutPanel({data = {}}) {
    const [isDragOver, setIsDragOver] = useState();

    const dropListener = useContext(DropListenerContext);
    const [$data, setData] = useObserver(data);
    usePlaceHolderListener(placeHolder, "drop", (event) => {
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        debugger;
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
        } else {
            const parentIds = traceParentId(placeHolder.parentElement, rootRef.current);
            setData(oldData => {
                let newData = oldData;
                for (const id of parentIds) {
                    newData.children = [...newData.children];
                    newData = newData.children.filter(d => d.id === id)[0];
                }
                newData.children = newData.children || [];
                newData.children.splice(childIndex, 0, {
                    id: uuid(),
                    ...data,
                });
                newData.children = [...newData.children];
                return JSON.parse(JSON.stringify(oldData));
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
        if (placeHolder.parentElement !== event.currentTarget) {
            event.currentTarget.append(placeHolder);
        }
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

const handleDragOver = (placeHolder) => {
    return (event) => {
        event.stopPropagation();
        event.preventDefault();
        const currentTarget = event.currentTarget;
        const parentTarget = currentTarget.parentNode;
        const elementPosition = currentTarget.getBoundingClientRect();
        const isLayout = currentTarget.getAttribute('data-layout');

        const mouseIsUp = event.clientY < (elementPosition.top + 10);
        const mouseIsDown = event.clientY > (elementPosition.top + (elementPosition.height - 10));
        const mouseIsLeft = event.clientX < (elementPosition.left + 10);
        const mouseIsRight = event.clientX > (elementPosition.left + (elementPosition.width - 10));

        const parentLayout = parentTarget.getAttribute('data-layout');

        if (parentLayout === 'horizontal') {
            if (mouseIsLeft) {
                parentTarget.insertBefore(placeHolder, currentTarget);
            } else if (mouseIsRight) {
                const nextSibling = currentTarget.nextSibling;
                if (nextSibling) {
                    parentTarget.insertBefore(placeHolder, nextSibling);
                } else {
                    parentTarget.appendChild(placeHolder);
                }
            } else if (isLayout === 'horizontal') {
                currentTarget.appendChild(placeHolder);
            } else if (isLayout === 'vertical') {
                currentTarget.appendChild(placeHolder);
            }
        }
        if (parentLayout === 'vertical') {
            if (mouseIsUp) {
                parentTarget.insertBefore(placeHolder, currentTarget);
            } else if (mouseIsDown) {
                const nextSibling = currentTarget.nextSibling;
                if (nextSibling) {
                    parentTarget.insertBefore(placeHolder, nextSibling);
                } else {
                    parentTarget.appendChild(placeHolder);
                }
            } else if (isLayout === 'horizontal') {
                currentTarget.appendChild(placeHolder);
            } else if (isLayout === 'vertical') {
                currentTarget.appendChild(placeHolder);
            }
        }
        console.log(elementPosition);
        console.log(currentTarget);
        console.log(event);
    }
}

function renderChild(child, controller) {
    switch (child.type) {
        case Controls.HORIZONTAL : {
            return <Horizontal
                key={child.id} onDragOver={handleDragOver(placeHolder)}
                p={2}
                style={{minHeight: 30}} brightness={-2} color={"light"}
                data-id={child.id}
                onDragEnter={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (placeHolder.parentElement !== event.currentTarget) {
                        event.currentTarget.append(placeHolder);
                    }
                }}
            >{child.children && child.children.map(child => renderChild(child, controller))}</Horizontal>

        }
        case Controls.LABEL : {
            return <Vertical key={child.id} onDragOver={handleDragOver(placeHolder)} p={2} pT={1}
                             pB={1}>Label</Vertical>
        }
        case Controls.TEXT : {
            return <Vertical key={child.id} onDragOver={handleDragOver(placeHolder)} p={2} pT={1} pB={1}>
                <Controller render={Input} type={"input"} label={"Input"} controller={controller}
                            name={"input"} disabled={false}/>
            </Vertical>
        }
        case Controls.TEXT_AREA : {
            return <Vertical key={child.id} onDragOver={handleDragOver(placeHolder)} p={2} pT={1} pB={1}>
                <Controller render={TextArea} rows={3} label={"Text Area"} controller={controller}
                            name={"textarea"} disabled={false}/>
            </Vertical>
        }
        case Controls.BUTTON : {
            return <Vertical key={child.id} onDragOver={handleDragOver(placeHolder)} p={2} pT={1} pB={1}>
                <Button color={"primary"}>Button</Button>
            </Vertical>
        }
        default : {
            return <Vertical onDragOver={handleDragOver(placeHolder)}/>
        }
    }
}

const RenderLayout = memo(({value, controller}) => {

    if (value === undefined) {
        return false;
    }
    return value.map(child => renderChild(child, controller));
});