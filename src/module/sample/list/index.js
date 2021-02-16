import React from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import List from "components/list/List";
import useObserver, {useObserverValue} from "components/useObserver";
import Button from "components/button/Button";
import {v4 as uuid} from "uuid";
import PaginatedList from "components/list/PaginatedList";

export default function ListExample() {
    const [$data, setData] = useObserver([]);
    const [$selectedItem, setSelectedItem] = useObserver(null);
    return <Vertical gap={10}>
        <Horizontal>
            <Button onClick={() => setData(oldData => ([...oldData, {id: uuid(), name: ''}]))}>Add</Button>
            <Button onClick={() => setData(oldData => oldData.filter(d => d !== $selectedItem.current))}>Delete</Button>
        </Horizontal>
        <List $data={$data}
              dataKey={data => data.id}
              itemRenderer={MyComponent}
              $selectedItem={$selectedItem}
              setSelectedItem={setSelectedItem}
              onKeyboardDown={() => setSelectedItem($data.current[$data.current.indexOf($selectedItem.current) + 1])}
              onKeyboardUp={() => setSelectedItem($data.current[$data.current.indexOf($selectedItem.current) - 1])}
        />
        <PaginatedList $data={$data}
                       dataKey={data => data.id}
                       itemRenderer={MyComponent}
                       $selectedItem={$selectedItem}
                       setSelectedItem={setSelectedItem}
                       onKeyboardDown={() => setSelectedItem($data.current[$data.current.indexOf($selectedItem.current) + 1])}
                       onKeyboardUp={() => setSelectedItem($data.current[$data.current.indexOf($selectedItem.current) - 1])}/>
    </Vertical>
}


function MyComponent({data, index, $selectedItem, setSelectedItem}) {
    const selectedItem = useObserverValue($selectedItem);
    const isSelected = data === selectedItem;
    return <Vertical color={"light"} brightness={isSelected ? -3 : -1}
                     onClick={() => setSelectedItem(data)}>{data?.id}</Vertical>
}