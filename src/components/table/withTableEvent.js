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
        return <Component onBeforeChange={(oldVal, newVal) => eventHandlerInvoker(handleBeforeSelectedRowChange, {
            oldVal: oldVal,
            newVal: newVal
        })}
                          onBeforeDataChange={() => {
                              // TODO
                          }}
                          onDataChange={() => {
                              // TODO
                          }}
                          onChange={(value) => eventHandlerInvoker(handleSelectedRowChange, {value: value})}
                          {...nextProps}
        />
    }
}