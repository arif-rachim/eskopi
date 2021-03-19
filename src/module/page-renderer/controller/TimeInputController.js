import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import InputTime from "components/input/InputTime";

export default function TimeInputController({
                                                data,
                                                control,
                                                ...controllerProps
                                            }) {
    const {id, children, type, parentIds, width, ...props} = data;

    return <Vertical p={2} pT={1} pB={1} width={width}>
        <Controller render={InputTime}
                    control={control}
                    label={"Time"}
                    style={{
                        transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)'
                    }}
                    {...controllerProps} {...props}/>
    </Vertical>
}