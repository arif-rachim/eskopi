import {Horizontal, Vertical} from "components/layout/Layout";
import List from "components/list/List";
import useObserver, {useObserverListener} from "components/useObserver";

function DefaultTreeItemRender({data}) {
    const key = data.key_;
    const level = key.length;
    return <Horizontal>
        <Vertical>{level}</Vertical>
        <Vertical>{JSON.stringify(data)}</Vertical>
    </Horizontal>
}


const DEFAULT_DATA_KEY = (data) => data?.id;

/**
 * Tree data should contains children which is an array.
 * @param {{children:[],id:string}[]} $data
 * @param {React.FunctionComponent} itemRenderer
 * @param {function(data:*):string} dataKey
 * @param {function(event:*):void} onKeyboardUp
 * @param {function(event:*):void} onKeyboardDown
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Tree({
                                 $data,
                                 itemRenderer = DefaultTreeItemRender,
                                 dataKey = DEFAULT_DATA_KEY,
                                 onKeyboardDown,
                                 onKeyboardUp,
                                 ...props
                             }) {

    const [$listData, setListData] = useObserver(() => flatArray($data.current, [], [], dataKey));

    useObserverListener($data, (data) => {
        setListData(flatArray(data, [], [], dataKey));
    })

    // lets make the data flat first
    return <List $data={$listData} itemRenderer={itemRenderer} dataKey={dataKey} onKeyboardUp={onKeyboardUp}
                 onKeyboardDown={onKeyboardDown} {...props} />
}

const flatArray = (array, result, parentKey, dataKey) => {
    return array.reduce((acc, next) => {
        const {children, ...item} = next;
        const key = dataKey(item);
        item.key_ = [...parentKey, key];
        item.children = children ? children.length : 0;
        acc.push(item)
        if (children) {
            acc = flatArray(children, acc, item.key_, dataKey);
        }
        return acc;
    }, result);
}