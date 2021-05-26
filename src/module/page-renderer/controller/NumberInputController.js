import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import InputNumber from "components/input/InputNumber";

export default function NumberInputController({
                                                  data,
                                                  control,
                                                  style,
                                                  containerProps,
                                                  ...controllerProps
                                              }) {
    const {id, children, type, parentIds, width, ...props} = data;

    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={InputNumber}
                    control={control}
                    style={style}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}