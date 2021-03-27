import {useRef} from "react";
import {Vertical} from "components/layout/Layout";
import useObserver from "components/useObserver";
import {Header} from "components/app-shell/Header";
import Menu from "components/app-shell/Menu";
import Footer from "components/app-shell/Footer";


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
    return <Vertical height={'calc(100% - 49px)'}>
        {children}
        <Menu $showMenu={$showMenu} setShowMenu={setShowMenu} menuButtonRef={menuButtonRef}/>
    </Vertical>
}

