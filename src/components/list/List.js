import {Vertical} from "components/layout/Layout";
import useObserver, {useObserverListener, useObserverValue} from "components/useObserver";
import {useState} from "react";
import {isFunction} from "components/utils";

const DEFAULT_DATA_KEY = (data) => {
    if (data && !('id' in data)) {
        console.error('There is no `id` key in ', data);
    }
    return data?.id
};

function handleOnRowChange(onChange, setSelectedRow) {
    return function onRowChange(data) {
        setSelectedRow(data);
        if (onChange) {
            onChange(data);
        }
    };
}

/**
 *
 * @param {any[]} $data
 * @param {React.FunctionComponent} itemRenderer
 * @param {function(data:*):string} dataKey
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
                                 domRef,
                                 $value,
                                 onChange,
                                 ...props
                             }) {
    const [$selectedRow, setSelectedRow] = useObserver(() => {
        if ($value) {
            return $value.current;
        }
        return undefined;
    });
    useObserverListener($value, (newValue) => {
        if ($selectedRow.current !== newValue) {
            setSelectedRow(newValue);
        }
    })
    const Renderer = itemRenderer;
    const data = useObserverValue($data) || [];
    return <Vertical domRef={domRef} tabIndex={0} style={{outline: 'none'}} onKeyDown={(event) => {
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            const currentSelectedIndex = $data.current.indexOf($selectedRow.current);
            if (($data.current.length - 1) > currentSelectedIndex) {
                const nextRow = $data.current[currentSelectedIndex + 1];
                setSelectedRow(nextRow);
                if (onChange) {
                    onChange(nextRow);
                }
            }
        }
        if (event.code === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            const currentSelectedIndex = $data.current.indexOf($selectedRow.current);
            if (currentSelectedIndex > 0) {
                const nextRow = $data.current[currentSelectedIndex - 1];
                setSelectedRow(nextRow);
                if (onChange) {
                    onChange(nextRow);
                }
            }
        }
    }}>
        {data.map((data, index) => {
            return <Renderer key={dataKey.apply(data, [data])}
                             data={data}
                             index={index}
                             dataKey={dataKey}
                             $value={$selectedRow}
                             $list={$data}
                             onChange={handleOnRowChange(onChange, setSelectedRow)} {...props}/>
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