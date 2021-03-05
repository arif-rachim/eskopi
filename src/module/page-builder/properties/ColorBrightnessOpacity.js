import {Horizontal,Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Select from "../../../components/input/Select";
import useObserver from "../../../components/useObserver";
import Input from "../../../components/input/Input";

export function ColorBrightnessOpacity({controller}) {
    const [$verticalData, setVerticalData] = useObserver(['top', 'bottom', 'center']);
    const [$horizontalData, setHorizontalData] = useObserver(['left', 'center', 'right']);
    const [$layoutData,setLayoutData] = useObserver(['horizontal','vertical']);
    return <Vertical>
        <Horizontal gap={5} p={2}>
            <Controller label={'Color'} horizontalLabelPositionWidth={60}
                        render={Input} name={'layout'} flex={'1 0 auto'}
                        controller={controller}
                        containerStyle={{width : '50%'}}/>
            <Controller label={'Brightness'} horizontalLabelPositionWidth={60} render={Input} name={'brightness'}
                        flex={'1 0 auto'} controller={controller}
                        containerStyle={{width : '50%'}}
            />
        </Horizontal>
        <Horizontal gap={5} p={2}>
            <Controller label={'Alpha'} horizontalLabelPositionWidth={60}
                        render={Input} name={'alpha'} flex={'1 0 auto'}
                        controller={controller}
                        containerStyle={{width : '50%'}}/>
            <Controller label={'Opacity'} horizontalLabelPositionWidth={60} render={Input} name={'opacity'}
                        flex={'1 0 auto'} controller={controller}
                        containerStyle={{width : '50%'}}
            />
        </Horizontal>
    </Vertical>
}