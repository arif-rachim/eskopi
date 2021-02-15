import {Vertical} from "components/layout/Layout";
import {useCallback, useEffect, useRef, useState} from "react";
import usePageLayers from "components/page/usePageLayers";

export default function useSlideDownPanel(animationDuration = 300) {
    const showPageLayer = usePageLayers();
    return useCallback((render) => {
        return showPageLayer(closePanel => <SlideDownContainer
            closePanel={closePanel}
            animationDuration={animationDuration}
            render={render}
        />)
    }, [animationDuration, showPageLayer]);
}


function SlideDownContainer({closePanel, animationDuration = 300, render}) {
    const disableAnimationRef = useRef(true);

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

    useEffect(() => {
        if (contentHeight === 0) {
            return;
        }
        disableAnimationRef.current = false;
        setShow(true);
    }, [contentHeight]);
    const Render = render;

    return <Vertical height={'100%'} width={'100%'} left={0} top={0} color={show ? "light" : 'transparent'}
                     opacity={show ? 0.6 : 0} brightness={-10} blur={1}
                     position={"absolute"} hAlign={'center'} overflow={"hidden"}
                     transition={`all ${animationDuration}ms cubic-bezier(0,0,0.7,0.9)`}>
        <Vertical domRef={contentContainerRef} color={"primary"} top={show ? 0 : (contentHeight * -1)}
                  transition={`top ${disableAnimationRef.current ? 0 : animationDuration}ms cubic-bezier(0,0,0.7,0.9)`}
                  elevation={2}>
            <Render closePanel={handleClose}/>
        </Vertical>
    </Vertical>
}