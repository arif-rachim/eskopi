import {Horizontal, Vertical} from "components/layout/Layout";
import Tree from "components/tree/Tree";
import useObserver, {useObserverListener} from "components/useObserver";
import {v4 as uuid} from "uuid";
import Button from "components/button/Button";
import {useState} from "react";

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
              itemRenderer={DataItemRenderer}
              setData={setData}
        />
    </Vertical>
}

/**
 * This is the function that will loop into the tree and find the object in the tree.
 * @param {any[]} oldData
 * @param {string[]} key
 * @param {function(data):string} dataKey
 * @returns {any}
 */
function findTreeDataFromKey(oldData = [], key = [], dataKey) {
    const [keyPath, ...rest] = key;
    const [filteredData] = oldData.filter(data => dataKey(data) === keyPath);
    if (rest && rest.length > 0) {
        return findTreeDataFromKey(filteredData.children, rest, dataKey);
    }
    return filteredData;
}

function DataItemRenderer({$selectedItem, setSelectedItem, index, data, setData, dataKey}) {
    const level = data.key_.length;
    const [selected, setSelected] = useState(false);
    useObserverListener($selectedItem, (selectedItem) => {
        setSelected(selectedItem === data);
    });
    return <Horizontal onClick={() => setSelectedItem(data)} color={"light"} brightness={selected ? -10 : -2}>
        <Vertical flex={1}>{level}</Vertical>
        <Vertical flex={5}>{data.name}</Vertical>

        <Button onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setData(oldData => {
                const originalData = findTreeDataFromKey(oldData, data.key_, dataKey);
                originalData.children = originalData.children || [];
                originalData.children.push({id: uuid(), name: 'ABC 123', children: []});
                return [...oldData];
            });
        }}>Add Child</Button>
    </Horizontal>
}