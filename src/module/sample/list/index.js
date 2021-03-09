import React from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import List from "components/list/List";
import useObserver, {useObserverValue} from "components/useObserver";
import Button from "components/button/Button";
import {v4 as uuid} from "uuid";
import PaginatedList from "components/list/PaginatedList";

export default function ListExample() {
    const [$data, setData] = useObserver([]);
    const [$value, onChange] = useObserver(null);
    return <Vertical gap={10}>
        <Horizontal>
            <Button onClick={() => setData(oldData => ([...oldData, {id: uuid(), name: ''}]))}>Add</Button>
            <Button onClick={() => setData(oldData => oldData.filter(d => d !== $value.current))}>Delete</Button>
        </Horizontal>
        <List $data={$data}
              dataKey={data => data.id}
              itemRenderer={MyComponent}
              $value={$value}
              onChange={onChange}
              onKeyboardDown={() => onChange($data.current[$data.current.indexOf($value.current) + 1])}
              onKeyboardUp={() => onChange($data.current[$data.current.indexOf($value.current) - 1])}
        />
        <PaginatedList $data={$data}
                       dataKey={data => data.id}
                       itemRenderer={MyComponent}
                       $value={$value}
                       onChange={onChange}
                       onKeyboardDown={() => onChange($data.current[$data.current.indexOf($value.current) + 1])}
                       onKeyboardUp={() => onChange($data.current[$data.current.indexOf($value.current) - 1])}/>


    </Vertical>
}


function MyComponent({data, index, $value, onChange}) {
    const selectedItem = useObserverValue($value);
    const isSelected = data === selectedItem;
    return <Vertical color={"light"} brightness={isSelected ? -3 : -1}
                     onClick={() => onChange(data)}>{data?.id}</Vertical>
}