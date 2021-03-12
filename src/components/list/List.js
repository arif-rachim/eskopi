import {Vertical} from "components/layout/Layout";
import {useObserverListener, useObserverValue} from "components/useObserver";
import {useState} from "react";
import {isFunction} from "components/utils";

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
 * @param {observer} $value
 * @param {function(data)} onChange
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
                                 $value,
                                 onChange,
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
            return <Renderer key={dataKey.apply(data, [data])}
                             data={data}
                             index={index}
                             dataKey={dataKey}
                             $value={$value}
                             $list={$data}
                             onChange={onChange} {...props}/>
        })}
    </Vertical>
}


function DefaultItemRender({data, onChange, $value, dataKey}) {
    const [selected, setSelected] = useState(() => {
        if ($value?.current) {
            return dataKey($value.current) === dataKey(data)
        }
        return undefined;
    })
    useObserverListener($value, (selectedItem) => {
        setSelected(dataKey(selectedItem) === dataKey(data))
    })
    return <Vertical p={1} color={"light"} brightness={selected ? -1 : 0} onClick={() => {
        if (isFunction(onChange)) {
            onChange(data);
        }
    }}>{data}</Vertical>
}