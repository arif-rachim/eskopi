import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import InputDate from "components/input/InputDate";
import {useInputControllerAction} from "module/page-renderer/controller/TextInputController";

export default function DateInputController({
                                                data,
                                                control,
                                                style,
                                                containerProps,
                                                ...controllerProps
                                            }) {
    const {id, children, type, parentIds, width, ...props} = data;
    const domRef = useInputControllerAction(data);
    return <Vertical p={2} pT={1} pB={1} width={width} domRef={domRef} {...containerProps}>
        <Controller render={InputDate}
                    control={control}
                    style={style}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}