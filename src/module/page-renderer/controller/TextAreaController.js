import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import TextArea from "components/input/TextArea";

export default function TextAreaController({
                                               data,
                                               control,
                                               style,
                                               containerProps,
                                               ...controllerProps
                                           }) {
    const {id, children, type, parentIds, width, ...props} = data;

    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={TextArea} rows={3}  control={control}
                    disabled={false}
                    style={style}
                    autoComplete={'off'}
                    {...controllerProps} {...props}/>
    </Vertical>
}