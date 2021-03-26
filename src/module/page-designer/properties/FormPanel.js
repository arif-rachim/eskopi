import {Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Select from "components/input/Select";
import useObserver from "components/useObserver";
import useResource, {useResourceListener} from "components/useResource";
import {SYSTEM_ACTIONS, SYSTEM_VALIDATIONS} from "components/SystemTableName";

function FormPanel({control}) {
    const [$data, setData] = useObserver();
    const [$validation, setValidation] = useObserver();
    const [$onLoadActionNames] = useResource({url: `/db/${SYSTEM_ACTIONS}`});
    const [$onLoadValidation] = useResource({url: `/db/${SYSTEM_VALIDATIONS}`});
    useResourceListener($onLoadActionNames, (status, result) => {
        if (status === 'success') {
            setData(result);
        }
    });
    useResourceListener($onLoadValidation, (status, result) => {
        if (status === 'success') {
            setValidation(result);
        }
    });
    return <Vertical p={2} gap={2}>
        <Controller label={'Form'} horizontalLabelPositionWidth={60}
                    name={'onSubmit'}
                    flex={'1 0 auto'}
                    render={Select}
                    autoCaps={false}
                    $data={$data}
                    control={control}
                    dataKey={data => data?.id}
                    dataToLabel={data => data?.label}
        />
        <Controller label={'Validation'} horizontalLabelPositionWidth={60}
                    name={'validation'}
                    flex={'1 0 auto'}
                    render={Select}
                    autoCaps={false}
                    $data={$validation}
                    control={control}
                    dataKey={data => data?.id}
                    dataToLabel={data => data?.label}
        />
    </Vertical>
}

FormPanel.title = 'Form';
export default FormPanel;