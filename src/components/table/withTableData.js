import useResource, {useResourceListener} from "components/useResource";
import useObserver from "components/useObserver";
import {useEffect} from "react";
import {useControlRegistration} from "components/page/useControlRegistration";

export default function withTableData(Component) {
    return function WithData(props) {


        let tableId = props?.data?.dataResource?.resource?.id_;
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

        function refreshGrid() {
            loadResource(url);
        }

        refreshGrid.propTypes = {};

        useControlRegistration({
            name: props?.data?.name,
            id: props?.data?.id,
            actions: {
                refreshGrid
            }
        });
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