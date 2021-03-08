import {Horizontal, Vertical} from "components/layout/Layout";
import Panel from "components/panel/Panel";
import useResource from "components/useResource";
import {useObserverListener} from "components/useObserver";

function DBExplorer() {
    const [$resource, getDbList, $pending] = useResource({url: '/db'});
    useObserverListener()

    return <Vertical>
        <Horizontal width={'100%'} color={'red'}>
            <Vertical flex={'1 0 auto'}>
                <Panel headerTitle={'Root'}>
                    One
                </Panel>
            </Vertical>
            <Vertical flex={'1 0 auto'}>
                <Panel headerTitle={'Root'}>
                    One
                </Panel>
            </Vertical>
            <Vertical flex={'1 0 auto'}>
                <Panel headerTitle={'Root'}>
                    Three
                </Panel>
            </Vertical>
            <Vertical flex={'1 0 auto'}>
                <Panel headerTitle={'Root'}>
                    Four
                </Panel>
            </Vertical>

        </Horizontal>
    </Vertical>
}

DBExplorer.title = 'Database Explorer';
export default DBExplorer;