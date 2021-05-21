import GroupController from "module/page-renderer/controller/GroupController";
import useForm from "components/useForm";
import useEventHandlerInvoker from "components/useEventHandlerInvoker";

export default function FormController({
                                           data,
                                           control: formControl,
                                           style,
                                           containerProps,
                                           ...controllerProps
                                       }) {

    const {handleSubmit: onHandleSubmit, handleLoad: onHandleLoad, ...dataProps} = data;
    const {control, handleSubmit, reset} = useForm();
    const eventHandlerInvoker = useEventHandlerInvoker({control, handleSubmit, reset});
    return <GroupController data={dataProps}
                            control={control}
                            style={style}
                            element={'form'}
                            onSubmit={handleSubmit(data => {
                                return eventHandlerInvoker(onHandleSubmit);
                            })}
                            containerProps={containerProps}
                            {...controllerProps}
    />
}
