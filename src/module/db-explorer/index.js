import {Horizontal, Vertical} from "components/layout/Layout";
import Panel from "components/panel/Panel";
import useResource, {useResourceListener} from "components/useResource";
import useObserver, {useObserverValue} from "components/useObserver";
import List from "components/list/List";


function DBExplorer() {
    const [$resource, getDbList, $pending] = useResource({url: '/db'});
    const [$listTables, setListTables] = useObserver([]);
    const [$selectedTable, setSelectedTable] = useObserver();
    useResourceListener($resource, (status, value) => {
        if (status === 'success') {
            setListTables(value);
        }
    });

    return <Vertical height={'100%'}>
        <Horizontal width={'100%'} height={'100%'}>
            <Vertical flex={'1 0 auto'}>
                <Panel headerTitle={'Tables'}>
                    <List $data={$listTables}
                          dataKey={data => data}
                          itemRenderer={MyComponent}
                          $value={$selectedTable}
                          onKeyboardDown={() => setSelectedTable($listTables.current[$listTables.current.indexOf($selectedTable.current) + 1])}
                          onKeyboardUp={() => setSelectedTable($listTables.current[$listTables.current.indexOf($selectedTable.current) - 1])}/>
                </Panel>
            </Vertical>
        </Horizontal>
    </Vertical>
}


function MyComponent({data, index, $value, onChange}) {
    const selectedItem = useObserverValue($value);
    const isSelected = data === selectedItem;

    return <Vertical color={"light"} brightness={isSelected ? -3 : -1}
                     onClick={() => onChange(data)}>{data}</Vertical>
}

DBExplorer.title = 'Database Explorer';
export default DBExplorer;