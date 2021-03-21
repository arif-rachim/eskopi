import {Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Select from "components/input/Select";
import useObserver from "components/useObserver";
import useResource, {useResourceListener} from "components/useResource";

function DataPanel({control}) {
    const [$data, setData] = useObserver();
    const [$onLoadTableNames] = useResource({url: '/db/'});
    useResourceListener($onLoadTableNames, (status, result) => {
        if (status === 'success') {
            setData(result);
        }
    });
    return <Vertical p={2} gap={2}>
        <Controller label={'Resource'} horizontalLabelPositionWidth={50}
                    name={'resourceTable'}
                    flex={'1 0 auto'}
                    render={Select}
                    autoCaps={false}
                    $data={$data}
                    control={control}
                    dataKey={data => data?.id}
                    dataToLabel={data => data?.label}
        />
    </Vertical>
}


DataPanel.title = 'Data';
export default DataPanel;