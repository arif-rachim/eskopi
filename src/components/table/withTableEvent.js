import useEventHandlerInvoker from "components/useEventHandlerInvoker";

export default function withTableEvent(Component) {
    return function WithTableEvent(props) {
        let {
            handleSelectedRowChange,
            handleBeforeSelectedRowChange,
            handleDataChange,
            handleBeforeDataChange,
            ...data
        } = props?.data;
        const eventHandlerInvoker = useEventHandlerInvoker();
        const nextProps = {...props, data}
        // @TODO THIS IS NOT COMPLETE YET !!
        return <Component onBeforeChange={handleBeforeSelectedRowChange}
                          onChange={(oldVal, nextVal) => {
                              eventHandlerInvoker()
                          }}
                          onBeforeDataChange={handleBeforeDataChange}
                          onDataChange={handleDataChange}
                          {...nextProps} />
    }
}