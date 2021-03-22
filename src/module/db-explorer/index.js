import {Horizontal, Vertical} from "components/layout/Layout";
import useResource, {useResourceListener} from "components/useResource";
import useObserver, {useObserverListener} from "components/useObserver";
import Panel from "components/panel/Panel";
import List from "components/list/List";
import AutoPopulateColumnTable from "components/table/AutoPopulateColumnTable";
import {useEffect} from "react";

function DBExplorer({setTitle}) {
    useEffect(() => {
        if (setTitle) {
            setTitle('DB Explorer')
        }
    }, [setTitle]);
    const [$table, setTable] = useObserver([]);
    const [$tableResource] = useResource({url: '/db'});
    const [$selectedTable, setSelectedTable] = useObserver();
    const [$tableContentResource, setTableContentResource] = useResource();
    const [$tableContent, setTableContent] = useObserver();
    useResourceListener($tableResource, (status, result) => {
        if (status === 'success') {
            setTable(result);
        }
    });
    useObserverListener($selectedTable, selectedTable => {
        setTableContentResource('/db/' + selectedTable.id);
    });
    useResourceListener($tableContentResource, (status, tableContent) => {
        if (status === 'success') {
            setTableContent(tableContent);
        }
    })
    return <Horizontal width={'100%'} height={'100%'}>
        <Vertical color={'light'} brightness={1} bR={1} height={'100%'} flex={'0 0 200px'}>
            <Panel headerTitle={'Tables'}>
                <List $data={$table}
                      dataKey={data => data?.id}
                      $value={$selectedTable}
                      onChange={setSelectedTable}
                      dataToLabel={data => data?.label}
                />
            </Panel>
        </Vertical>
        <Vertical color={'light'} brightness={1} flex={'1 0 auto'}>
            <AutoPopulateColumnTable $data={$tableContent} dataKey={data => data?.id_}/>
        </Vertical>
    </Horizontal>
}


DBExplorer.title = 'Database Explorer';
export default DBExplorer;