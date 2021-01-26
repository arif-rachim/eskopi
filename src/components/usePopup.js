import useLayers from "./useLayers";

/**
 * showPopup(closePanel => <Popup closePanel={closePanel}/>,{anchorRef,position:{bottom-left,bottom-right,top-left,top-right}})
 */
export default function usePopup() {
    const showPanel = useLayers();
    return (popupFactory, {anchorRef, matchWithAnchorWidth = false, isRightAlign = false, isAbove = false}) => {
        return showPanel(closePanel => {
            const panel = popupFactory(closePanel);
            return <Popup anchorRef={anchorRef}
                          isRightAlign={isRightAlign}
                          isAbove={isAbove}
                          matchWithAnchorWidth={matchWithAnchorWidth}>
                {panel}
            </Popup>
        })
    };
}

/**
 *
 * @param {useRef} anchorRef
 * @param {boolean} isRightAlign
 * @param {boolean} isAbove
 * @param {boolean} matchWithAnchorWidth
 * @param {*} props
 * @returns {JSX.Element}
 * @constructor
 */
function Popup({anchorRef, isRightAlign = false, isAbove = false, matchWithAnchorWidth, ...props}) {
    const {top, left, width, height} = anchorRef.current.getBoundingClientRect();
    let popupTop = top;
    let popupLeft = left;
    if (!isAbove) {
        popupTop = popupTop + height;
    }
    if (isRightAlign) {

        popupLeft = popupLeft + width;
    }
    const popupContainerStyle = {position: 'absolute'};
    if (isAbove) {
        popupContainerStyle.bottom = 0;
    } else {
        popupContainerStyle.top = 0;
    }
    if(matchWithAnchorWidth){
        popupContainerStyle.width = width;
    }
    return <div style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: isRightAlign ? 'flex-end' : 'flex-start',
        top: popupTop,
        left: popupLeft,
        width: 0
    }} onClick={e => e.preventDefault()}>
        <div style={popupContainerStyle}>{props.children}</div>
    </div>
}
