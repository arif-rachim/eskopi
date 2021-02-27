import {Vertical} from "components/layout/Layout";
import {memo, useContext, useEffect, useRef} from "react";
import {DropListenerContext} from "module/page-builder/index";
import {ObserverValue, useObserverMapper} from "components/useObserver";
import {v4 as uuid} from "uuid";
import {Controls} from "module/page-builder/ControlPanel";
import useForm from "components/useForm";
import {styleToString} from "components/utils";
import SpaceController from "./controller/SpaceController";
import LabelController from "module/page-builder/controller/LabelController";
import ButtonController from "module/page-builder/controller/ButtonController";
import TextInputController from "module/page-builder/controller/TextInputController";
import TextAreaController from "module/page-builder/controller/TextAreaController";

/**
 * Function to return placeHolder object
 * @param style
 * @returns {HTMLElement}
 */
export function getPlaceHolder(style = undefined) {
    const innerStyle = {
        border: '1px solid #666',
        minWidth: '30px',
        minHeight: '30px',
        boxSizing: 'border-box',
        display: 'none'
    }
    if (document.getElementById('my-element') === null) {
        const element = document.createElement('div');
        element.setAttribute('style', styleToString(innerStyle));
        element.setAttribute('id', 'my-element');
        document.body.appendChild(element);
    }
    const placeHolder = document.getElementById('my-element');
    if (style) {
        placeHolder.setAttribute('style', styleToString({...innerStyle, ...style}));
    }
    return placeHolder;
}


/**
 * @param {'dragover','dragleave','dragenter','drag','drop','dragend','dragexit'} event
 * @param {function(event)} listener
 */
function usePlaceHolderListener(event, listener) {
    useEffect(() => {
        const placeHolder = getPlaceHolder();
        placeHolder.addEventListener(event, listener);
        return () => {
            placeHolder.removeEventListener(event, listener);
        }
    }, [event, listener]);
}

/**
 * Function to get parent element ids from current parentElement
 * @param element
 * @param root
 * @returns {string[]|*[]}
 */
function traceParentId(element, root) {
    const parentElement = element.parentElement;
    const dataId = parentElement.getAttribute('data-id');
    if (parentElement.parentElement !== root) {
        const newResult = traceParentId(parentElement, root);
        return [...newResult, dataId];
    } else {
        return [dataId];
    }
}


export default function LayoutPanel({$data,setData,setSelectedController}) {
    const dropListener = useContext(DropListenerContext);
    usePlaceHolderListener("drop", (event) => {
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        // we need to know the parent first
        const placeHolder = getPlaceHolder();
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
            const parentIds = traceParentId(placeHolder, rootRef.current);
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
    const handleDragLeave = () => {
        dragHoverCountRef.current--;
        if (dragHoverCountRef.current > 0) {

        }
    }
    const handleDrop = (event) => {
        getPlaceHolder({display: 'none'});
        event.preventDefault();
        event.stopPropagation();
        dragHoverCountRef.current = 0;
        dropListener.current.call();

    }
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }
    const rootRef = useRef();
    const {controller} = useForm();
    return <Vertical color={"light"} brightness={-3} p={3} flex={1}>
        <Vertical domRef={rootRef} color={"light"} brightness={0} flex={1} elevation={1}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop} p={2} data-layout={'vertical'}>

            <ObserverValue $observer={useObserverMapper($data, data => data.children)} render={RenderLayoutMemo}
                           controller={controller} setSelectedController={setSelectedController} path={[]}/>
        </Vertical>
    </Vertical>
}

export const handleDragOver = () => {
    return (event) => {
        event.stopPropagation();
        event.preventDefault();
        const currentTarget = event.currentTarget;
        const parentTarget = currentTarget.parentNode;
        const elementPosition = currentTarget.getBoundingClientRect();
        const isLayout = currentTarget.getAttribute('data-layout');
        const heightPad = isLayout ? 5 : 0.3 * elementPosition.height;
        const widthPad = isLayout ? 5 : 0.3 * elementPosition.width;
        const mouseIsUp = event.clientY < (elementPosition.top + heightPad);
        const mouseIsDown = event.clientY > (elementPosition.top + (elementPosition.height - heightPad));
        const mouseIsLeft = event.clientX < (elementPosition.left + widthPad);
        const mouseIsRight = event.clientX > (elementPosition.left + (elementPosition.width - widthPad));

        const parentLayout = parentTarget.getAttribute('data-layout');
        const placeHolder = getPlaceHolder({display: 'block'});
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
                if (placeHolder.parentElement !== currentTarget) {
                    currentTarget.appendChild(placeHolder);
                }
            } else if (isLayout === 'vertical') {
                if (placeHolder.parentElement !== currentTarget) {
                    currentTarget.appendChild(placeHolder);
                }
            }
        }
    }
}


export function renderChild(path,child, controller,setSelectedController) {

    if (child.type === Controls.SPACE) {
        return <SpaceController key={child.id} data={child} path={path} formController={controller} setSelectedController={setSelectedController}/>
    }
    if (child.type === Controls.LABEL) {
        return <LabelController key={child.id} data={child} path={path} formController={controller} setSelectedController={setSelectedController}/>
    }
    if (child.type === Controls.BUTTON) {
        return <ButtonController key={child.id} data={child} path={path} formController={controller} setSelectedController={setSelectedController}/>
    }
    if (child.type === Controls.TEXT_INPUT) {
        return <TextInputController key={child.id} data={child} path={path} formController={controller} setSelectedController={setSelectedController}/>
    }
    if (child.type === Controls.TEXT_AREA) {
        return <TextAreaController key={child.id} data={child} path={path} formController={controller} setSelectedController={setSelectedController}/>
    }
}

const RenderLayout = ({value, controller,setSelectedController,path}) => {
    if (value === undefined) {
        return false;
    }
    return value.map(child => renderChild(path,child, controller,setSelectedController));
}
const RenderLayoutMemo = memo(RenderLayout);