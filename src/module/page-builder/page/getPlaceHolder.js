import {styleToString} from "components/utils";
import {useEffect} from "react";

const listeners = [];

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
        const placeHolder = document.getElementById('my-element');
        for (const listener of listeners) {
            placeHolder.addEventListener(listener.event, listener.listener);
        }
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
export function usePlaceHolderListener(event, listener) {
    useEffect(() => {
        const eventListener = {event, listener};
        listeners.push(eventListener);
        getPlaceHolder().addEventListener(event, listener);
        return () => {
            listeners.splice(listeners.indexOf(eventListener), 1);
            getPlaceHolder().removeEventListener(event, listener);
        }
    }, [event, listener]);
}