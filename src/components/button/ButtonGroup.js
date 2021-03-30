import {Horizontal} from "components/layout/Layout";
import useObserver, {useObserverListener, useObserverValue} from "components/useObserver";
import ToggleButton from "components/button/ToggleButton";
import {useEffect, useRef, useState} from "react";

const DEFAULT_DATA_TO_LABEL = (data) => data?.label;
const DEFAULT_DATA_KEY = (data) => data?.id_ ? data.id_ : data?.id;

function ToggleButtonRenderer({item, selectedItem, dataToLabel, onClick, dataKey}) {
    const propsRef = useRef({});
    const [$toggle, setToggle] = useObserver(dataKey(item) === dataKey(selectedItem));
    propsRef.current.dataKey = dataKey;
    propsRef.current.setToggle = setToggle;
    useEffect(() => propsRef.current.setToggle(propsRef.current.dataKey(item) === propsRef.current.dataKey(selectedItem)),
        [selectedItem, item]);
    return <ToggleButton $toggle={$toggle} onClick={onClick} bR={2}
                         style={{border: 'none'}}>{dataToLabel(item)}</ToggleButton>
}

export default function ButtonGroup({
                                        $data,
                                        $value,
                                        onChange,
                                        dataToLabel = DEFAULT_DATA_TO_LABEL,
                                        dataKey = DEFAULT_DATA_KEY,
                                        containerStyle,
                                        ...props
                                    }) {
    const data = useObserverValue($data);
    const [selectedItem, setSelectedItem] = useState($value?.current);
    useObserverListener($value, value => setSelectedItem(value));
    return <Horizontal style={containerStyle}>
        {data.map((item, index) => {
            return <ToggleButtonRenderer key={dataKey(item)} item={item} selectedItem={selectedItem} dataKey={dataKey}
                                         dataToLabel={dataToLabel}
                                         onClick={() => {
                                             setSelectedItem(item);
                                             if (onChange) {
                                                 onChange(item)
                                             }
                                         }}
            />
        })}
    </Horizontal>
}