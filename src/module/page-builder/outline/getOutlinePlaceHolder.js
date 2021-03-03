import {styleToString} from "components/utils";
import {useEffect} from "react";

const listeners = [];

export default function getOutlinePlaceHolder(style) {
    const innerStyle = {
        border: '1px dashed #666',
        width: '100%',
        height: '20px',
        boxSizing: 'border-box',
        display: 'none'
    }
    if (document.getElementById('outline-place-holder') === null) {
        const element = document.createElement('div');
        element.setAttribute('style', styleToString(innerStyle));
        element.setAttribute('id', 'outline-place-holder');
        document.body.appendChild(element);
        const placeHolder = document.getElementById('outline-place-holder');
        for (const listener of listeners) {
            placeHolder.addEventListener(listener.event, listener.listener);
        }
    }
    const placeHolder = document.getElementById('outline-place-holder');
    if (style) {
        placeHolder.setAttribute('style', styleToString({...innerStyle, ...style}));
    }
    return placeHolder;
}


/**
 * @param {'dragover','dragleave','dragenter','drag','drop','dragend','dragexit'} event
 * @param {function(event)} listener
 */
export function useOutlinePlaceHolderListener(event, listener) {
    useEffect(() => {
        const eventListener = {event, listener};
        listeners.push(eventListener);
        getOutlinePlaceHolder().addEventListener(event, listener);
        return () => {
            listeners.splice(listeners.indexOf(eventListener), 1);
            getOutlinePlaceHolder().removeEventListener(event, listener);
        }
    }, [event, listener]);
}