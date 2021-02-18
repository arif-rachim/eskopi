import {Horizontal, Vertical} from "components/layout/Layout";
import Tree from "components/tree/Tree";
import useObserver from "components/useObserver";
import {v4 as uuid} from "uuid";
import Button from "components/button/Button";

export default function TreeSample() {
    const [$data, setData] = useObserver([{
        id: uuid(),
        name: 'Sample',
        children: []
    }]);
    const [$selectedItem, setSelectedItem] = useObserver(null);
    return <Vertical>
        <Horizontal>
            <Button onClick={() => setData(oldData => ([...oldData, {
                id: uuid(),
                name: 'SETANS',
                children: []
            }]))}>Add</Button>
            <Button onClick={() => setData(oldData => oldData.filter(d => d !== $selectedItem.current))}>Delete</Button>
        </Horizontal>
        <Tree $data={$data}
              $selectedItem={$selectedItem}
              setSelectedItem={setSelectedItem}
              itemRenderer={MyComponent}
              setData={setData}
        />
    </Vertical>
}

function MyComponent(props) {
    return <Vertical vAlign={'center'} pT={0.5}>
        {props.data.name}
    </Vertical>
}
