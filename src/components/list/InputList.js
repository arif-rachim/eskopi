import {Vertical} from "components/layout/Layout";
import {useObserverMapper, useObserverValue} from "components/useObserver";
import {isFunction} from "components/utils";
import {mapToNameFactory} from "components/input/Input";
import useTheme from "components/useTheme";


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

function handleOnRowChange(rowIndex, onChange) {
    return function onRowChange(data) {
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

function RenderList({$dataProvider, dataKey, dataToLabel, $nameValue, onChange, props, itemRenderer}) {
    const Renderer = itemRenderer;
    const dataProvider = useObserverValue($dataProvider);
    return <>
        {dataProvider && dataProvider.map((data, index) => {
            return <Renderer key={dataKey.apply(data, [data])}
                             data={data}
                             index={index}
                             dataKey={dataKey}
                             dataToLabel={dataToLabel}
                             $value={$nameValue}
                             onChange={handleOnRowChange(index, onChange)} {...props}/>
        })}
    </>;
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
    const error = useObserverValue($errorValue);
    const showError = error && error.length > 0;
    const [theme] = useTheme();
    return <Vertical domRef={domRef} tabIndex={0} style={{
        outline: 'none',
        border: showError ? `1px solid ${theme.danger}` : '1px solid rgba(0,0,0,0)'
    }}>
        <RenderList
            $dataProvider={$nameValue}
            dataKey={dataKey}
            dataToLabel={dataToLabel} $nameValue={$nameValue}
            onChange={onChange}
            props={props}
            itemRenderer={itemRenderer}/>
    </Vertical>
}


function DefaultItemRenderer({data, index, dataKey, dataToLabel, $value, onChange, ...props}) {
    const value = dataToLabel.call(null, data);
    return <Vertical color={"light"} p={2}>{value}</Vertical>
}