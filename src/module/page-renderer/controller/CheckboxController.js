import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import Checkbox from "../../../components/input/Checkbox";
import {useInputControllerAction} from "module/page-renderer/controller/TextInputController";

export default function CheckboxController({
                                               data,
                                               control,
                                               containerProps,
                                               style,
                                               ...controllerProps
                                           }) {
    const {children, type, parentIds, width, ...props} = data;
    const domRef = useInputControllerAction(data);
    return <Vertical p={2} pT={1} pB={1} width={width} domRef={domRef} {...containerProps}>
        <Controller render={Checkbox}
                    control={control}
                    style={style}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}