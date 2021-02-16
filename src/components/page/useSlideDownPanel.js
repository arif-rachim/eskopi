import {Vertical} from "components/layout/Layout";
import {useCallback, useEffect, useRef, useState} from "react";
import usePageLayers from "components/page/usePageLayers";

export default function useSlideDownPanel(animationDuration = 300) {
    const showPageLayer = usePageLayers();
    return useCallback((render, {actionRef = undefined} = {
        actionRef: undefined
    }) => {
        return showPageLayer(closePanel => <SlideDownContainer
            actionRef={actionRef}
            closePanel={closePanel}
            animationDuration={animationDuration}
            render={render}
        />)
    }, [animationDuration, showPageLayer]);
}


function SlideDownContainer({closePanel, animationDuration = 300, render, actionRef}) {
    const disableAnimationRef = useRef(true);
    actionRef = actionRef || {current: null};
    const [show, setShow] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentContainerRef = useRef();

    // this is the first initialization of the height
    useEffect(() => {
        setContentHeight(contentContainerRef.current.getBoundingClientRect().height);
    }, []);

    const handleClose = (result) => {
        setShow(false);
        setTimeout(() => closePanel(result), animationDuration);
    }

    actionRef.current = {
        setShowPanel: setShow,
        isShowing: show
    }

    useEffect(() => {
        if (contentHeight === 0) {
            return;
        }
        disableAnimationRef.current = false;
        requestAnimationFrame(() => setShow(true));
    }, [contentHeight]);
    const Render = render;

    return <Vertical height={'100%'} width={'100%'} left={0} top={0} color={"light"}
                     alpha={show ? 0.6 : 0} blur={0.5} brightness={-10}
                     position={"absolute"} hAlign={'center'} overflow={"hidden"}
                     transition={`all ${animationDuration}ms cubic-bezier(0,0,0.7,0.9)`}>
        <Vertical domRef={contentContainerRef} color={"light"} top={show ? 0 : (contentHeight * -1)}
                  transition={`top ${disableAnimationRef.current ? 0 : animationDuration}ms cubic-bezier(0,0,0.7,0.9)`}
                  elevation={2}>
            <Render closePanel={handleClose}/>
        </Vertical>
    </Vertical>
}