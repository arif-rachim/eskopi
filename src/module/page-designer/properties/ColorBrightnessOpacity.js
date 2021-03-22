import {Horizontal, Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Select from "../../../components/input/Select";
import useObserver from "../../../components/useObserver";
import Input from "../../../components/input/Input";

function ColorBrightnessOpacity({control}) {
    const [$color,] = useObserver(['primary', 'secondary', 'danger', 'light', 'dark']);
    return <Vertical>
        <Horizontal gap={5} p={2}>
            <Controller label={'Color'} horizontalLabelPositionWidth={60}
                        render={Select} name={'color'} flex={'1 0 auto'}
                        control={control}
                        containerStyle={{width: '50%'}}
                        $data={$color}
                        dataKey={data => data}
            />
            <Controller label={'Brightness'} horizontalLabelPositionWidth={60} render={Input} name={'brightness'}
                        flex={'1 0 auto'} control={control}
                        containerStyle={{width: '50%'}}
            />
        </Horizontal>
        <Horizontal gap={5} p={2}>
            <Controller label={'Alpha'} horizontalLabelPositionWidth={60}
                        render={Input} name={'alpha'} flex={'1 0 auto'}
                        control={control}
                        containerStyle={{width: '50%'}}/>
            <Controller label={'Opacity'} horizontalLabelPositionWidth={60} render={Input} name={'opacity'}
                        flex={'1 0 auto'} control={control}
                        containerStyle={{width: '50%'}}
            />
        </Horizontal>
    </Vertical>
}

ColorBrightnessOpacity.title = 'Color Brightness and Opacity';

export default ColorBrightnessOpacity;