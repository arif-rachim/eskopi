import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import TextArea from "components/input/TextArea";
import {useEffect, useRef} from "react";
import {useControlRegistration} from "components/page/useControlRegistration";

export default function TextAreaController({
                                               data,
                                               control,
                                               style,
                                               containerProps,
                                               ...controllerProps
                                           }) {
    const {id, children, type, parentIds, width, ...props} = data;
    const domRef = useTextAreaControllerAction(data);
    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={TextArea} rows={3} control={control}
                    disabled={false}
                    style={style}
                    autoComplete={'off'}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}

function useTextAreaControllerAction(data) {
    const domRef = useRef();
    const textAreaRef = useRef();
    useEffect(() => {
        textAreaRef.current = domRef.current.querySelector('textarea');
    }, []);
    useControlRegistration({
        dataFieldName: data?.dataFieldName,
        controllerName: data?.controllerName,
        id: data?.id,
        actions: {
            focus: () => {
                textAreaRef.current.focus();
            },
            getValue: () => textAreaRef.current.innerText
        }
    });
    return domRef;
}