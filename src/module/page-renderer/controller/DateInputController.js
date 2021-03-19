import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import InputDate from "components/input/InputDate";

export default function DateInputController({
                                                data,
                                                control,
                                                ...controllerProps
                                            }) {
    const {id, children, type, parentIds, width, ...props} = data;
    return <Vertical p={2} pT={1} pB={1} width={width}>
        <Controller render={InputDate}
                    control={control}
                    name={"date"}
                    label={"Date"}
                    style={{
                        transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)'
                    }}
                    {...controllerProps} {...props}/>
    </Vertical>
}