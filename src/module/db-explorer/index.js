import {Horizontal, Vertical} from "components/layout/Layout";
import useResource, {useResourceListener} from "components/useResource";
import useObserver, {useObserverListener, useObserverValue,ObserverValue} from "components/useObserver";
import SidePanel from "components/panel/SidePanel";
import Panel from "../../components/panel/Panel";

function DBExplorer() {
    const [$resource, getDbList, $pending] = useResource({url: '/db'});
    const [$listTables, setListTables] = useObserver([]);
    const [$selectedTable, setSelectedTable] = useObserver();
    const [$navigationStack, setNavigationStack] = useObserver([]);
    const [$togglePanel,setTogglePanel] = useObserver(false);
    useResourceListener($resource, (status, value) => {
        if (status === 'success') {
            setListTables(value);
        }
    });
    useObserverListener($navigationStack, (stacks) => {
        getDbList('/db/' + stacks.join('/'));
    });

    return <Vertical height={'100%'}>
        <Horizontal width={'100%'} height={'100%'}>
            <Vertical flex={'1 0 auto'}>
                <ObserverValue $observers={$togglePanel} >{(togglePanel) => {
                    const Layout = togglePanel ? SidePanel : Panel;
                    return <Layout headerRenderer={HeaderRenderer} setTogglePanel={setTogglePanel}>
                        Hello World
                    </Layout>
                }}</ObserverValue>
            </Vertical>
        </Horizontal>
    </Vertical>
}

function HeaderRenderer({setTogglePanel}){
    return <Horizontal onClick={() => setTogglePanel(panel => !panel)}>{'Tables'}</Horizontal>
}

function ItemRenderer({data, index, $value, onChange, $navigationStack}) {
    const selectedItem = useObserverValue($value);
    const isSelected = data === selectedItem;

    return <Vertical color={"light"} brightness={isSelected ? -3 : -1}
                     onClick={() => onChange(data)}>{JSON.stringify(data)}
    </Vertical>
}

DBExplorer.title = 'Database Explorer';
export default DBExplorer;