import {Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import useEventHandlerInvoker from "components/useEventHandlerInvoker";

export default function ButtonController({
                                             data,
                                             control,
                                             style,
                                             containerProps,
                                             ...controllerProps
                                         }) {
    const eventHandlerInvoker = useEventHandlerInvoker();
    const {handleClick: onHandleClick} = data;
    return <Vertical p={2} pT={1} pB={1} {...containerProps}>
        <Button color={"primary"} style={style} {...controllerProps} type={data.buttonType}
                onClick={() => {
                    return eventHandlerInvoker(onHandleClick);
                }}
        >{data.label || 'Button'}</Button>
    </Vertical>
}