import useObserver, {useObserverListener, useObserverMapper, useObserverValue} from "components/useObserver";
import useClickOutside from "components/useClickOutside";
import useForm, {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import Input from "components/input/Input";
import {useRef} from "react";
import useResource, {useResourceListener} from "components/useResource";
import {SYSTEM_PAGES} from "../SystemTableName";
import Tree from "../tree/Tree";

const defaultMenus = {
    'Page Builder': {
        path: 'page-builder'
    },
    'DB Explorer': {
        path: 'db-explorer'
    },
};

export default function Menu({$showMenu, setShowMenu, menuButtonRef}) {

    const domRef = useRef();
    useClickOutside([domRef, menuButtonRef], event => {
        setShowMenu(false);
    });
    const menus = defaultMenus; // later on we can pull dynamic menus from database.
    const {control} = useForm({search: ''});
    const [$onPageLoad] = useResource({url: `/db/${SYSTEM_PAGES}`});
    const [$menuTree, setMenuTree] = useObserver();
    useResourceListener($onPageLoad, (status, pageLoad) => {
        if (status === 'success') {
            setMenuTree(pageLoad[0]);
        }
    })
    const [$selectedMenu, setSelectedMenu] = useObserver();

    useObserverListener($selectedMenu, (newValue) => {
        window.location.hash = `#page-renderer/${newValue.id}`;
        setShowMenu(false);
    });

    return <Vertical domRef={domRef}
                     top={0} height={'100%'} brightness={0.5}
                     position={"absolute"}
                     color={"light"}
                     width={200}
                     left={useObserverValue($showMenu) ? 0 : -200} transition={'left 200ms cubic-bezier(0,0,0.7,0.9)'}
                     bR={1}>
        <Vertical p={1} bB={1}>
            <Controller name={'search'} control={control} render={Input} validateOn={'change'}
                        placeholder={'Search'}/>
        </Vertical>

        {Object.keys(menus).map(menu => {
            return <Vertical key={menu} color={"light"} cursor={"pointer"}
                             brightness={-0.2} brightnessHover={-0.6}
                             brightnessMouseDown={-0.9}
                             bB={1} p={1} onClick={() => {
                window.location.hash = `#${menus[menu].path}`;
                setShowMenu(false);
            }}>
                {menu}
            </Vertical>
        })}

        <Tree $data={useObserverMapper($menuTree, tree => tree?.children)}
              $value={$selectedMenu}
              onChange={(value) => setSelectedMenu(value)}
              rowProps={{
                  color: "light",
                  cursor: "pointer",
                  brightness: -0.2,
                  brightnessHover: -0.6,
                  brightnessMouseDown: -0.9,
                  bB: 1,
                  p: 1
              }}
        />
    </Vertical>
}
