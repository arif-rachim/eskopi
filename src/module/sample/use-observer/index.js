import useStateObserver from "components/useStateObserver";
import {Horizontal, Vertical} from "../../../components/layout/Layout";
import {useEffect, useState} from "react";


export default function UseObserver() {
    const [observer, setObserver] = useStateObserver(new Date());
    useEffect(() => {
        setInterval(() => {
            setObserver(new Date());
        }, 1000)
    }, [setObserver]);
    return <Vertical vAlign={'center'} hAlign={'center'} height={'100%'}>
        <MyComponent observer={observer}/>
    </Vertical>
}

function MyComponent({observer}) {
    const [state, setState] = useState(observer.current);
    useEffect(() => {
        return observer.addListener(setState);
    }, [observer]);

    return <Horizontal>
        {JSON.stringify(state)}
    </Horizontal>
}