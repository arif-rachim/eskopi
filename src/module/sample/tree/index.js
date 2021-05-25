import {Horizontal, Vertical} from "components/layout/Layout";
import Tree, {findTreeDataFromKey} from "components/tree/Tree";
import useObserver from "components/useObserver";
import Button from "components/button/Button";
import {uuid} from "components/utils";

export default function TreeSample() {
    const [$data, setData] = useObserver([{
        id: uuid(),
        name: uuid(),
        children: []
    }]);
    const [$value, onChange] = useObserver(null);
    return <Vertical>
        <Horizontal>
            <Button onClick={() => setData(oldData => ([...oldData, {
                id: uuid(),
                name: uuid(),
                children: []
            }]))}>Add</Button>
            <Button onClick={() => setData(oldData => oldData.filter(d => d !== $value.current))}>Delete</Button>
        </Horizontal>
        <Tree $data={$data}
              $value={$value}
              onChange={onChange}
              itemRenderer={MyComponent}
              setData={setData}
        />
    </Vertical>
}

function MyComponent(props) {
    return <Horizontal>
        <Vertical vAlign={'center'} pT={0.5} flex={1}>
            {props.data.name}
        </Vertical>
        <Button p={0} pL={2} pR={2} onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            props.setData(oldData => {
                const originalData = findTreeDataFromKey(oldData, props.data.key_, props.dataKey);
                originalData.children = originalData.children || [];
                originalData.children.push({id: uuid(), name: uuid(), children: []});
                return [...oldData];
            });
        }}>Add Child</Button>
    </Horizontal>

}
