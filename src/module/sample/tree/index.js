import {Horizontal, Vertical} from "components/layout/Layout";
import Tree from "components/tree/Tree";
import useObserver, {ObserverValue, useObserverListener, useObserverValue} from "components/useObserver";
import {v4 as uuid} from "uuid";
import Button from "components/button/Button";
import {useEffect, useState} from "react";

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

function ToggleButton({$open, setOpen, width}) {
    const open = useObserverValue($open);
    return <Button p={0} pT={0} pB={0} vAlign={"center"} color={'light'} opacity={0} b={0} width={width}
                   onClick={() => setOpen(val => !val)}>
        {open &&
        <svg viewBox='0 0 512 512'>
            <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='48'
                  d='M112 184l144 144 144-144'/>
        </svg>
        }
        {!open &&
        <svg viewBox='0 0 512 512'>
            <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='48'
                  d='M184 112l144 144-144 144'/>
        </svg>
        }
    </Button>;
}

function DataItemRenderer({$selectedItem, setSelectedItem, index, data, setData, dataKey}) {
    const level = data.key_.length;
    const [selected, setSelected] = useState(false);
    const [$expand, setExpand] = useObserver(true);
    const [$toggleButtonVisible, setToggleButtonVisible] = useObserver(data.children > 0);
    useObserverListener($selectedItem, (selectedItem) => setSelected(selectedItem === data));
    useEffect(() => setToggleButtonVisible(data.children > 0), [data, setToggleButtonVisible]);

    return <Horizontal onClick={() => setSelectedItem(data)} color={"light"} brightness={selected ? -10 : -2}>
        <Horizontal width={(level - 1) * 15}/>
        <ObserverValue $observer={$toggleButtonVisible} render={({value}) => {
            if (!value) {
                return <Horizontal width={15}/>
            }
            return <ToggleButton $open={$expand} setOpen={setExpand} width={15}/>
        }}/>
        <Vertical flex={5} pT={0.5}>{data.name}</Vertical>
        <Button p={0} pL={2} pR={2} onClick={(event) => {
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