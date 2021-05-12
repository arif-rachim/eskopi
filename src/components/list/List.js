import {Vertical} from "components/layout/Layout";
import useObserver, {ObserverValue, useObserverListener, useObserverMapper} from "components/useObserver";
import {useCallback, useState} from "react";
import {isFunction, isNullOrUndefined} from "components/utils";
import {mapToNameFactory} from "components/input/Input";


export const DEFAULT_DATA_KEY = (data) => {
    if (data && typeof data === 'string') {
        return data;
    }
    if (data && 'id_' in data) {
        return data.id_;
    }
    if (data && 'id' in data) {
        return data.id;
    }
    return undefined;
};

export const DEFAULT_DATA_TO_LABEL = (data) => data;

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
 * @param name
 * @param {any[]} $data
 * @param {React.FunctionComponent} itemRenderer
 * @param {function(data:*):string} dataKey
 * @param {function(data:*):string} dataToLabel
 * @param {any} domRef
 * @param {observer} $value
 * @param {observer} $errors
 * @param {function(data)} onChange - event when selected Item is change
 * @param {function(data)} onDataChange - event when the $data is change
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function List({
                                 name,
                                 $data,
                                 itemRenderer = DefaultItemRenderer,
                                 dataKey = DEFAULT_DATA_KEY,
                                 dataToLabel = DEFAULT_DATA_TO_LABEL,
                                 domRef,
                                 $value,
                                 $errors,
                                 onChange,
                                 onDataChange,
                                 ...props
                             }) {

    const $nameValue = useObserverMapper($value, mapToNameFactory(name));
    // eslint-disable-next-line
    const $errorValue = useObserverMapper($errors, mapToNameFactory(name));

    const [$selectedRow, setSelectedRow] = useObserver($nameValue?.current);
    const [$tableData, setTableData] = useObserver($data?.current);

    const onChangeCallback = useCallback((newValue) => {
        if (isNullOrUndefined(onChange)) {
            return;
        }
        onChange(oldState => {
            oldState = oldState || {};
            const nextState = {...oldState};
            if (isNullOrUndefined(name) || name === '') {
                return isFunction(newValue) ? newValue(nextState) : newValue;
            } else {
                const oldValue = nextState[name];
                nextState[name] = isFunction(newValue) ? newValue(oldValue) : newValue;
                return nextState;
            }
        })
    }, [name, onChange]);

    useObserverListener($nameValue, (value) => {
        if ($selectedRow.current !== value) {
            setSelectedRow(value);
        }
    })

    useObserverListener($data, data => {
        if ($tableData.current !== data) {
            setTableData(data);
        }
    });

    useObserverListener($nameValue, (newValue) => {
        if ($selectedRow.current !== newValue) {
            setSelectedRow(newValue);
        }
    })
    const Renderer = itemRenderer;

    return <Vertical domRef={domRef} tabIndex={0} style={{outline: 'none'}} onKeyDown={(event) => {
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            const currentSelectedIndex = $data.current.indexOf($selectedRow.current);
            if (($data.current.length - 1) > currentSelectedIndex) {
                const nextRow = $data.current[currentSelectedIndex + 1];
                setSelectedRow(nextRow);
                if (onChangeCallback) {
                    onChangeCallback(nextRow);
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
        <ObserverValue $observers={$data}>
            {(data) => {
                data = data || [];
                if (!Array.isArray(data)) {
                    return false;
                }
                return data.map((data, index) => {
                    return <Renderer key={dataKey.apply(data, [data])}
                                     data={data}
                                     index={index}
                                     dataKey={dataKey}
                                     dataToLabel={dataToLabel}
                                     $value={$selectedRow}
                                     $list={$data}
                                     onChange={handleOnRowChange(onChange, setSelectedRow)}
                                     onDataChange={handleOnRowDataChange(index, onDataChange)}
                                     {...props}/>
                })
            }}
        </ObserverValue>
    </Vertical>
}

function handleOnRowDataChange(rowIndex, onChange) {
    return function onRowDataChange(data) {
        if (onChange) {
            onChange(oldState => {
                const nextState = [...oldState];
                const oldValue = nextState[rowIndex];
                if (isFunction(data)) {
                    data = data(oldValue)
                }
                nextState.splice(rowIndex, 1, data);
                return nextState;
            });
        }
    };
}

function DefaultItemRenderer({data, onChange, $value, dataKey, dataToLabel, ...props}) {
    const [selected, setSelected] = useState(() => {
        if ($value?.current) {
            return dataKey($value.current) === dataKey(data)
        }
        return undefined;
    })
    useObserverListener($value, (selectedItem) => {
        setSelected(dataKey(selectedItem) === dataKey(data))
    });
    const value = dataToLabel.call(null, data);
    return <Vertical color={"light"} brightness={selected ? -2 : 0} onClick={() => {
        if (isFunction(onChange)) {
            onChange(data);
        }
    }} p={2}>{value}</Vertical>
}