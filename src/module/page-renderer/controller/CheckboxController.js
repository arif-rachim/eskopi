import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import Checkbox from "../../../components/input/Checkbox";

export default function CheckboxController({
                                               data,
                                               control,
                                               containerProps,
                                               style,
                                               ...controllerProps
                                           }) {
    const {children, type, parentIds, width, ...props} = data;

    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={Checkbox}
                    control={control}
                    style={style}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}