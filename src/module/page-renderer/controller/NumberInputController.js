import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import InputNumber from "components/input/InputNumber";
import {useInputControllerAction} from "module/page-renderer/controller/TextInputController";

export default function NumberInputController({
                                                  data,
                                                  control,
                                                  style,
                                                  containerProps,
                                                  ...controllerProps
                                              }) {
    const {id, children, type, parentIds, width, ...props} = data;
    const domRef = useInputControllerAction(data);
    return <Vertical p={2} pT={1} pB={1} domRef={domRef} width={width} {...containerProps}>
        <Controller render={InputNumber}
                    control={control}
                    style={style}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}