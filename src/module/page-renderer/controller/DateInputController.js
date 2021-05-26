import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import InputDate from "components/input/InputDate";

export default function DateInputController({
                                                data,
                                                control,
                                                style,
                                                containerProps,
                                                ...controllerProps
                                            }) {
    const {id, children, type, parentIds, width, ...props} = data;
    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={InputDate}
                    control={control}
                    style={style}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}