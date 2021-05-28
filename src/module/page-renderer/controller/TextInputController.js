import {Controller} from "components/useForm";
import Input from "components/input/Input";
import {Vertical} from "components/layout/Layout";
import {useControlRegistration} from "components/page/useControlRegistration";
import {useEffect, useRef} from "react";

export function useInputControllerAction(data) {
    const domRef = useRef();
    const inputRef = useRef();
    useEffect(() => {
        inputRef.current = domRef.current.querySelector('input');
    }, []);
    useControlRegistration({
        dataFieldName: data?.dataFieldName,
        controllerName: data?.controllerName,
        id: data?.id,
        actions: {
            focus: () => {
                inputRef.current.focus();
            },
            getValue: () => inputRef.current.value
        }
    });
    return domRef;
}

export default function TextInputController({
                                                data,
                                                control,
                                                containerProps,
                                                style,
                                                ...controllerProps
                                            }) {
    const {children, type, parentIds, width, ...props} = data;
    const domRef = useInputControllerAction(data);

    return <Vertical domRef={domRef} p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={Input}
                    type={"input"}
                    control={control}
                    autoComplete={'off'}
                    style={style}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}