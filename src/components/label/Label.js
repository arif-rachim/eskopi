import {Horizontal, Vertical} from "../layout/Layout";

export default function Label({label, ...props}) {
    return <label>
        <Vertical>
            <Horizontal style={{fontSize:'0.8rem'}}>{label}</Horizontal>
            {props.children}
        </Vertical>
    </label>
}