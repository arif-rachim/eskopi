import {Controller} from "components/useForm";
import Input from "components/input/Input";
import {Vertical} from "components/layout/Layout";

export default function TextInputController({
                                                data,
                                                control,
                                                ...controllerProps
                                            }) {
    const {id, children, type, parentIds, width, ...props} = data;

    return <Vertical p={2} pT={1} pB={1} width={width}>
        <Controller render={Input} type={"input"} label={"Input"} control={control}
                    disabled={false}
                    autoComplete={'off'}
                    style={{
                        transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)'
                    }}
                    {...controllerProps} {...props}/>
    </Vertical>
}