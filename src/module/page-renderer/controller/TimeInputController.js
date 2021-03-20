import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import InputTime from "components/input/InputTime";

export default function TimeInputController({
                                                data,
                                                control,
                                                style,
                                                containerProps,
                                                ...controllerProps
                                            }) {
    const {id, children, type, parentIds, width, ...props} = data;

    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={InputTime}
                    control={control}
                    label={"Time"}
                    style={style}
                    {...controllerProps} {...props}/>
    </Vertical>
}