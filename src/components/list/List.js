import {Vertical} from "components/layout/Layout";
import {useObserverListener, useObserverValue} from "components/useObserver";
import {useState} from "react";

const DEFAULT_DATA_KEY = (data) => {
    if (data && !('id' in data)) {
        console.error('There is no `id` key in ', data);
    }
    return data?.id
};

/**
 *
 * @param {any[]} $data
 * @param {React.FunctionComponent} itemRenderer
 * @param {function(data:*):string} dataKey
 * @param {function(event:*):void} onKeyboardUp
 * @param {function(event:*):void} onKeyboardDown
 * @param {any} domRef
 * @param {observer} $selectedItem
 * @param {function(data)} setSelectedItem
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function List({
                                 $data,
                                 itemRenderer = DefaultItemRender,
                                 dataKey = DEFAULT_DATA_KEY,
                                 onKeyboardDown,
                                 onKeyboardUp,
                                 domRef,
                                 $selectedItem,
                                 setSelectedItem,
                                 ...props
                             }) {
    const Renderer = itemRenderer;
    const data = useObserverValue($data) || [];
    return <Vertical domRef={domRef} tabIndex={0} style={{outline: 'none'}} onKeyDown={(event) => {
        if (event.code === 'ArrowDown' && onKeyboardDown) {
            event.preventDefault();
            event.stopPropagation();
            onKeyboardDown.call();
        }
        if (event.code === 'ArrowUp' && onKeyboardDown) {
            event.preventDefault();
            event.stopPropagation();
            onKeyboardUp.call();
        }
    }}>
        {data.map((data, index) => {
            return <Renderer key={dataKey.apply(data, [data])} data={data} index={index} dataKey={dataKey}
                             $selectedItem={$selectedItem}
                             setSelectedItem={setSelectedItem} {...props}/>
        })}
    </Vertical>
}


function DefaultItemRender({data, setSelectedItem, $selectedItem, dataKey}) {
    const [selected, setSelected] = useState(dataKey($selectedItem.current) === dataKey(data))
    useObserverListener($selectedItem, (selectedItem) => {
        setSelected(dataKey(selectedItem) === dataKey(data))
    })
    return <Vertical p={1} color={"light"} brightness={selected ? -1 : 0} onClick={() => {
        setSelectedItem(data);
    }}>{data}</Vertical>
}