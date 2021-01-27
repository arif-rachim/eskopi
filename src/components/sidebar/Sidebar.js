import React from "react";
import {Horizontal, Vertical} from "../layout/Layout";
import {useEffect, useRef, useState} from "react";

function calculateWidth(sidePanelRef) {
    if (sidePanelRef?.current) {
        return sidePanelRef.current.getBoundingClientRect().width;
    }
    return 0;
}

function effectOnSidebarChange(setShowSidebar) {
    return () => {
        const hideSidebar = () => setShowSidebar(false);
        window.addEventListener("click", hideSidebar);
        return () => window.removeEventListener('click', hideSidebar);
    };
}

/**
 *
 * @param {JSX.Element} sidePanel
 * @param {*} props
 * @returns {JSX.Element}
 * @constructor
 */
function Sidebar({sidePanel: SidePanel, ...props}) {
    const sidePanelRef = useRef();
    const [showSidebar, setShowSidebar] = useState(true);

    // eslint-disable-next-line
    useEffect(effectOnSidebarChange(setShowSidebar), [showSidebar]);
    const timeoutWhenMouseOverHandlerRef = useRef(0);
    return <Vertical position={"relative"} height={'100%'} {...props} overflow={'hidden'}>
        {props.children}
        <Horizontal domRef={sidePanelRef}
                    height={'100%'}
                    position={"absolute"}
                    top={0}
                    transition={'left 300ms ease-in-out'}
                    left={showSidebar ? 0 : -(calculateWidth(sidePanelRef) - 10)} onClick={(e) => e.stopPropagation()}>
            {<SidePanel setShowSidebar={setShowSidebar}/>}

            <Vertical width={10} color={"light"} opacity={0} onMouseEnter={() => {
                timeoutWhenMouseOverHandlerRef.current = setTimeout(() => {
                    setShowSidebar(true);
                }, 300);
            }} onMouseLeave={() => {
                clearTimeout(timeoutWhenMouseOverHandlerRef.current);
            }}>
            </Vertical>
        </Horizontal>
    </Vertical>
}

export default Sidebar;

