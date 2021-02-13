import {useEffect, useRef} from "react";
import {Vertical} from "components/layout/Layout";
import useUser, {EMPTY_USER} from "components/authentication/useUser";
import useGradient from "components/useGradient";
import useObserver, {useObserverValue} from "components/useObserver";
import {Header} from "components/app-shell/Header";
import useClickOutside from "components/useClickOutside";

export default function AppShell({children}) {
    const [$showMenu, setShowMenu] = useObserver(false);
    const menuButtonRef = useRef();
    return <Vertical height={'100%'}>
        <Header setShowMenu={setShowMenu} menuButtonRef={menuButtonRef}/>
        <Content $showMenu={$showMenu} setShowMenu={setShowMenu} menuButtonRef={menuButtonRef}>
            {children}
        </Content>
        <Footer/>
    </Vertical>
}

function Content({children, $showMenu, setShowMenu, menuButtonRef}) {

    return <Vertical height={'100%'}>
        {children}
        <Menu $showMenu={$showMenu} setShowMenu={setShowMenu} menuButtonRef={menuButtonRef}/>
    </Vertical>
}

function Menu({$showMenu, setShowMenu, menuButtonRef}) {
    const showMenu = useObserverValue($showMenu);
    const domRef = useRef();
    useClickOutside([domRef, menuButtonRef], event => {
        setShowMenu(false);
    });

    return <Vertical domRef={domRef} top={0} height={'100%'} position={"absolute"} color={"primary"} width={200}
                     left={showMenu ? 0 : -200} transition={'left 200ms cubic-bezier(0,0,0.7,0.9)'}>
        SHIT
    </Vertical>
}

function Footer() {
    const [$user] = useUser();
    const [$visible, setVisible] = useObserver($user.current !== EMPTY_USER);
    useEffect(() => {
        return $user.addListener((user) => {
            if (user !== EMPTY_USER) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        });
    }, [$user, setVisible]);
    const PANEL_GRADIENT = useGradient(180).stop(0, 'light', 0).stop(0.9, 'light', -3).stop(1, 'light', -5).toString();
    return <Vertical background={PANEL_GRADIENT} p={2} $visible={$visible}>
        My Footer
    </Vertical>
}