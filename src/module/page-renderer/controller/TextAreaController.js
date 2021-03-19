import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import TextArea from "components/input/TextArea";

export default function TextAreaController({
                                               data,
                                               control,
                                               ...controllerProps
                                           }) {
    const {id, children, type, parentIds, width, ...props} = data;

    return <Vertical p={2} pT={1} pB={1} width={width}>
        <Controller render={TextArea} rows={3} label={"Text Area"} control={control}
                    disabled={false}
                    style={{
                        transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)'
                    }}
                    autoComplete={'off'}
                    {...controllerProps} {...props}/>
    </Vertical>
}