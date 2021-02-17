import {useRef} from "react";
import {Vertical} from "components/layout/Layout";
import useUser, {EMPTY_USER} from "components/authentication/useUser";
import useGradient from "components/useGradient";
import useObserver, {useObserverListener, useObserverValue} from "components/useObserver";
import {Header} from "components/app-shell/Header";
import useClickOutside from "components/useClickOutside";
import Input from "../input/Input";
import useForm, {Controller} from "../useForm";

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
const defaultMenus = {
    'Page Builder' : {
        path : 'page-builder'
    },
    'Access Management' : {
        path : 'access-management'
    }
};
function Menu({$showMenu, setShowMenu, menuButtonRef}) {
    const showMenu = useObserverValue($showMenu);
    const domRef = useRef();
    useClickOutside([domRef, menuButtonRef], event => {
        setShowMenu(false);
    });
    const menus = defaultMenus; // later on we can pull dynamic menus from database.
    const {controller} = useForm({search:''});
    return <Vertical domRef={domRef}
                     top={0} height={'100%'} brightness={0.5}
                     position={"absolute"}
                     color={"light"}
                     width={200}
                     left={showMenu ? 0 : -200} transition={'left 200ms cubic-bezier(0,0,0.7,0.9)'} bR={1}>
        <Vertical p={1} bB={1} >
            <Controller name={'search'} controller={controller} render={Input} validateOn={'change'} placeholder={'Search'}/>
        </Vertical>

        {Object.keys(menus).map(menu => {
            return <Vertical key={menu} color={"light"} cursor={"pointer"}
                             brightness={-0.2} brightnessHover={-0.6}
                             brightnessMouseDown={-0.9}
                             bB={1} p={1} onClick={() => {
                window.location.hash = `#${menus[menu].path}`
            }}>
                {menu}
            </Vertical>
        })}
    </Vertical>
}

function Footer() {
    const [$user] = useUser();
    const [$visible, setVisible] = useObserver($user.current !== EMPTY_USER);
    useObserverListener($user, (user) => {
        if (user !== EMPTY_USER) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });
    const PANEL_GRADIENT = useGradient(180).stop(0, 'light', 0).stop(0.9, 'light', -3).stop(1, 'light', -5).toString();
    return <Vertical background={PANEL_GRADIENT} p={2} $visible={$visible}>
        My Footer
    </Vertical>
}