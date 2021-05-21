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
        // function refreshGrid() {
        // }
        // refreshGrid.propertyTypes = {};
        // useControlRegistration({
        //     name: props?.data?.name,
        //     id: props?.data?.id,
        //     actions: {
        //         refreshGrid
        //     }
        // });

        // onChange={(value) => {
        //     if (onChange) {
        //         onChange(value)
        //     }
        //     const f = new Function('data', 'actions', `(async(data,actions) => {${handleChange}})(data,actions)`);
        //     f.call({}, formControl?.current?.$value?.current, $actions?.current);
        // }}

        return <Component onBeforeChange={handleBeforeSelectedRowChange}
                          onChange={(oldVal, nextVal) => {
                              eventHandlerInvoker()
                          }}
                          onBeforeDataChange={handleBeforeDataChange}
                          onDataChange={handleDataChange}
                          {...nextProps} />
    }
}