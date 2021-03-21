import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import TableInput from "components/input/TableInput";

export default function TableInputController({
                                                 data,
                                                 control,
                                                 containerProps,
                                                 style,
                                                 ...controllerProps
                                             }) {
    const {children, type, parentIds, width, ...props} = data;
    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={TableInput}
                    control={control}
                    style={style}
                    {...controllerProps} {...props}/>
    </Vertical>
}