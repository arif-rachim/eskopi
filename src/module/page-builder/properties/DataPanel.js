import {Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Input from "components/input/Input";

function DataPanel({control}) {
    return <Vertical p={2} gap={2}>
        <Controller label={'Resource'} horizontalLabelPositionWidth={50}
                    render={Input}
                    name={'resourceName'} flex={'1 0 auto'}
                    control={control}
        />
    </Vertical>
}


DataPanel.title = 'Data';
export default DataPanel;