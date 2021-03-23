import {Vertical} from "components/layout/Layout";
import {useObserverMapper, useObserverValue} from "components/useObserver";
import {isFunction} from "components/utils";
import {mapToNameFactory} from "components/input/Input";


const DEFAULT_DATA_KEY = (data) => {
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

const DEFAULT_DATA_TO_LABEL = (data) => data;

function handleOnRowChange(fieldName, rowIndex, onChange) {
    return function onRowChange(data) {
        if (onChange) {
            onChange(oldState => {
                const nextState = {...oldState};
                const nextFieldValue = [...nextState[fieldName]];
                if (isFunction(data)) {
                    data = data(nextFieldValue[rowIndex])
                }
                nextFieldValue.splice(rowIndex, 1, data);
                nextState[fieldName] = nextFieldValue;
                return nextState;
            });
        }
    };
}

/**
 *
 * @param {any[]} $data
 * @param {React.FunctionComponent} itemRenderer
 * @param {function(data:*):string} dataKey
 * @param {function(data:*):string} dataToLabel
 * @param {any} domRef
 * @param {observer} $value
 * @param {function(data)} onChange
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function InputList({
                                      name,
                                      itemRenderer = DefaultItemRenderer,
                                      dataKey = DEFAULT_DATA_KEY,
                                      dataToLabel = DEFAULT_DATA_TO_LABEL,
                                      domRef,
                                      $value,
                                      $errors,
                                      onChange,
                                      ...props
                                  }) {
    const $nameValue = useObserverMapper($value, mapToNameFactory(name));
    const $errorValue = useObserverMapper($errors, mapToNameFactory(name));
    const Renderer = itemRenderer;
    const dataProvider = useObserverValue($nameValue);
    return <Vertical domRef={domRef} tabIndex={0} style={{outline: 'none'}}>
        {dataProvider && dataProvider.map((data, index) => {
            return <Renderer key={dataKey.apply(data, [data])}
                             data={data}
                             index={index}
                             dataKey={dataKey}
                             dataToLabel={dataToLabel}
                             $value={$nameValue}
                             onChange={handleOnRowChange(name, index, onChange)} {...props}/>
        })}
    </Vertical>
}


function DefaultItemRenderer({data, index, dataKey, dataToLabel, $value, onChange, ...props}) {
    const value = dataToLabel.call(null, data);
    return <Vertical color={"light"} p={2}>{value}</Vertical>
}