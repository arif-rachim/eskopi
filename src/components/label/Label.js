import {useState,useEffect} from "react";
import {Horizontal} from "../layout/Layout";

/**
 * @param {string} name
 * @param {*} observer
 * @param {*} props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Label({name,observer,...props}) {
    const [value,setValue] = useState(observer.current[name])
    useEffect(() => {
        return observer.addListener(name,setValue);
    },[name, observer]);
    return <Horizontal {...props}>{value}</Horizontal>
}