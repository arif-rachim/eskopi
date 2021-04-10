import {Horizontal, Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Select from "../../../components/input/Select";
import useObserver from "../../../components/useObserver";
import Input from "../../../components/input/Input";

function AlignmentAndGapPanel({control}) {
    const [$verticalData] = useObserver(['top', 'bottom', 'center']);
    const [$horizontalData] = useObserver(['left', 'center', 'right']);
    const [$layoutData] = useObserver(['horizontal', 'vertical']);
    return <Vertical>
        <Horizontal gap={5} p={2}>
            <Controller label={'Layout'} horizontalLabelPositionWidth={60}
                        render={Select} name={'layout'}
                        $data={$layoutData}
                        dataKey={data => data}
                        control={control}
                        containerStyle={{width: '49%'}}
            />
            <Controller label={'Gap'} horizontalLabelPositionWidth={60} render={Input} name={'gap'} control={control}
                        containerStyle={{width: '49%'}}
            />
        </Horizontal>
        <Horizontal gap={5} p={2}>
            <Controller label={'Vertical'} horizontalLabelPositionWidth={60}
                        render={Select} name={'vAlign'}
                        $data={$verticalData}
                        dataKey={data => data}
                        control={control}
                        containerStyle={{width: '49%'}}
            />
            <Controller label={'Horizontal'} horizontalLabelPositionWidth={60} render={Select} name={'hAlign'}
                        flex={'1 0 auto'} control={control}
                        dataKey={data => data}
                        $data={$horizontalData}
                        containerStyle={{width: '49%'}}
            />
        </Horizontal>
    </Vertical>
}

AlignmentAndGapPanel.title = 'Alignment and Gap';
export default AlignmentAndGapPanel;