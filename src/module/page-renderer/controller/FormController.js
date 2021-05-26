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
    const ignoreOldAttribute = true;
    // If you are updating actions of FormController please ensure you also update the FormTemplate.js
    useControlRegistration({
        controllerName: data?.controllerName,
        id: data?.id,
        actions: {
            getValue: () => control?.current?.$value?.current,
            reset: (initialValue) => reset(initialValue, ignoreOldAttribute),
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
