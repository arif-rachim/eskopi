import {Controller} from "components/useForm";
import Input from "components/input/Input";
import {Vertical} from "components/layout/Layout";

export default function TextInputController({
                                                data,
                                                control,
                                                containerProps,
                                                style,
                                                ...controllerProps
                                            }) {
    const {children, type, parentIds, width, ...props} = data;
    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={Input}
                    type={"input"}
                    control={control}
                    disabled={false}
                    autoComplete={'off'}
                    style={style}
                    {...controllerProps} {...props}/>
    </Vertical>
}