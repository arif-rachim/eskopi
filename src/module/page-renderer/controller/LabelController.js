import {Horizontal, Vertical} from "components/layout/Layout";

export default function LabelController({
                                            data,
                                            control,
                                            style,
                                            containerProps,
                                            ...controllerProps
                                        }) {
    return <Vertical p={2} pT={1} pB={1} {...containerProps}>
        <Horizontal style={style} {...controllerProps}>Label</Horizontal>
    </Vertical>
}