import {Horizontal, Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Select from "../../../components/input/Select";
import useObserver from "../../../components/useObserver";
import Input from "../../../components/input/Input";

function AlignmentAndGap({control}) {
    const [$verticalData] = useObserver(['top', 'bottom', 'center']);
    const [$horizontalData] = useObserver(['left', 'center', 'right']);
    const [$layoutData] = useObserver(['horizontal', 'vertical']);
    return <Vertical>
        <Horizontal gap={5} p={2}>
            <Controller label={'Layout'} horizontalLabelPositionWidth={60}
                        render={Select} name={'layout'} flex={'1 0 auto'}
                        $data={$layoutData}
                        dataKey={data => data}
                        control={control}
                        containerStyle={{width: '50%'}}
            />
            <Controller label={'Gap'} horizontalLabelPositionWidth={60} render={Input} name={'gap'}
                        flex={'1 0 auto'} control={control}
                        containerStyle={{width: '50%'}}
            />
        </Horizontal>
        <Horizontal gap={5} p={2}>
            <Controller label={'Vertical'} horizontalLabelPositionWidth={60}
                        render={Select} name={'vAlign'} flex={'1 0 auto'}
                        $data={$verticalData}
                        dataKey={data => data}
                        control={control}
                        containerStyle={{width: '50%'}}
            />
            <Controller label={'Horizontal'} horizontalLabelPositionWidth={60} render={Select} name={'hAlign'}
                        flex={'1 0 auto'} control={control}
                        dataKey={data => data}
                        $data={$horizontalData}
                        containerStyle={{width: '50%'}}
            />
        </Horizontal>
    </Vertical>
}

AlignmentAndGap.title = 'Alignment and Gap';
export default AlignmentAndGap;