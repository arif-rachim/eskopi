import {Vertical} from "components/layout/Layout";
import Button from "components/button/Button";

export default function ButtonController({
                                             data,
                                             control,
                                             style,
                                             containerProps,
                                             ...controllerProps
                                         }) {
    return <Vertical p={2} pT={1} pB={1} {...containerProps}>
        <Button color={"primary"} style={style} {...controllerProps}>{data.label || 'Button'}</Button>
    </Vertical>
}