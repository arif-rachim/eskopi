import useResource, {useResourceListener} from "components/useResource";
import useObserver from "components/useObserver";
import {useEffect} from "react";

export default function withTableData(Component) {
    return function WithData(props) {
        let tableId = props?.data?.resourceTable?.id;
        tableId = tableId || '';
        const url = `/db/${tableId}`;
        const [$onResourceLoad, loadResource] = useResource({url});
        const [$data, setData] = useObserver();
        useResourceListener($onResourceLoad, (status, result) => {
            setData(result);
        });
        useEffect(() => {
            loadResource(url)
        }, [loadResource, url]);
        const nextProps = {...props, data: removeProps(props.data, ['resourceTable'])}
        return <Component $data={$data} {...nextProps} />
    }
}

function removeProps(data, propsToRemove) {
    const result = {};
    Object.keys(data).filter(key => propsToRemove.indexOf(key) < 0).forEach(key => {
        result[key] = data[key];
    })
    return result;
}