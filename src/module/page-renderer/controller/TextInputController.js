import {Controller} from "components/useForm";
import Input from "components/input/Input";
import {Vertical} from "components/layout/Layout";
import {useControlRegistration} from "components/page/useControlRegistration";
import {useRef} from "react";

export default function TextInputController({
                                                data,
                                                control,
                                                containerProps,
                                                style,
                                                ...controllerProps
                                            }) {
    const {children, type, parentIds, width, ...props} = data;
    const domRef = useRef();
    useControlRegistration({
        dataFieldName: data?.dataFieldName,
        controllerName: data?.controllerName,
        id: data?.id,
        actions: {
            focus: () => {
                domRef.current.querySelector('input').focus();
            }
        }
    });

    return <Vertical domRef={domRef} p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={Input}
                    type={"input"}
                    control={control}
                    autoComplete={'off'}
                    style={style}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}