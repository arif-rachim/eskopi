import {Vertical} from "components/layout/Layout";
import {useEffect} from "react";

export default function PageListeners({setTitle}) {
    useEffect(() => {
        setTitle('Listeners');
    }, [setTitle]);
    return <Vertical>
        Hello Listeners!

    </Vertical>
}