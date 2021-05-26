import useResource, {useResourceListener} from "components/useResource";
import useObserver from "components/useObserver";
import {useEffect} from "react";
import {useControlRegistration} from "components/page/useControlRegistration";

export default function withTableData(Component) {
    return function WithData(props) {
        const {dataResource, ...data} = props?.data;
        const nextProps = {...props, data}
        let tableId = dataResource?.resource?.id_ || '';
        const url = `/db/${tableId}`;
        const [$onResourceLoad, loadResource] = useResource({url});
        const [$data, setData] = useObserver();
        useResourceListener($onResourceLoad, (status, result) => {
            setData(result);
        });
        useEffect(() => {
            loadResource(url)
        }, [loadResource, url]);

        function refreshGrid() {
            loadResource(url);
        }
        refreshGrid.propertyTypes = {};

        useControlRegistration({
            dataFieldName: props?.data?.dataFieldName,
            controllerName: props?.data?.controllerName,
            id: props?.data?.id,
            actions: {
                refreshGrid
            }
        });
        return <Component $data={$data} {...nextProps} />
    }
}
