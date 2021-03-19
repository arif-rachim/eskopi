import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import InputNumber from "components/input/InputNumber";

export default function NumberInputController({
                                                  data,
                                                  control,
                                                  ...controllerProps
                                              }) {
    const {id, children, type, parentIds, width, ...props} = data;

    return <Vertical p={2} pT={1} pB={1} width={width}>
        <Controller render={InputNumber}
                    control={control}
                    label={"Number"}
                    style={{
                        transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)'
                    }}
                    {...controllerProps} {...props}/>
    </Vertical>
}