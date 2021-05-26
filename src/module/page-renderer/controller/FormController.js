import GroupController from "module/page-renderer/controller/GroupController";
import useForm from "components/useForm";
import useEventHandlerInvoker from "components/useEventHandlerInvoker";
import {useControlRegistration} from "components/page/useControlRegistration";

export default function FormController({
                                           data,
                                           control: formControl,
                                           style,
                                           containerProps,
                                           ...controllerProps
                                       }) {

    const {handleSubmit: onHandleSubmitUsingData, handleLoad: onHandleLoad, ...dataProps} = data;
    const {control, handleSubmit, reset} = useForm();

    useControlRegistration({
        controllerName: data?.controllerName,
        id: data?.id,
        actions: {
            getValue: () => control?.current?.$value?.current,
            reset,
        }
    });
    const eventHandlerInvoker = useEventHandlerInvoker();
    return <GroupController data={dataProps}
                            control={control}
                            style={style}
                            element={'form'}
                            onSubmit={handleSubmit(data => {
                                return eventHandlerInvoker(onHandleSubmitUsingData);
                            })}
                            containerProps={containerProps}
                            {...controllerProps}
    />
}
