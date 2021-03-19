import {Vertical} from "../../components/layout/Layout";

export default function PageRenderer(props) {

    return <Vertical>
        {props.params}
    </Vertical>
}