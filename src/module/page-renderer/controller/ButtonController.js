import {Vertical} from "components/layout/Layout";
import Button from "components/button/Button";

export default function ButtonController({
                                             data,
                                             control,
                                             ...controllerProps
                                         }) {
    return <Vertical p={2} pT={1} pB={1}>
        <Button color={"primary"} {...controllerProps}>Button</Button>
    </Vertical>
}