import useEventHandlerInvoker from "components/useEventHandlerInvoker";

export default function withChangeHandler(Component) {
    return function WithChangeHandler(props) {
        const eventHandlerInvoker = useEventHandlerInvoker();
        const {handleChange, ...data} = props.data;
        const {onChange, ...restProps} = props;
        restProps.data = data;
        return <Component onChange={(value) => {
            if (onChange) {
                onChange(value)
            }
            return eventHandlerInvoker(handleChange);
        }} {...restProps}/>
    }
}