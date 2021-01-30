import {useState,useEffect} from "react";
import {calculateBrightness, Horizontal} from "../layout/Layout";
import useTheme from "../useTheme";

/**
 * @param {string} name
 * @param {string} color
 * @param {Object} style
 * @param {*} observer
 * @param {*} props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Label({name,color,observer,style,...props}) {
    const [value,setValue] = useState(observer.current[name]);
    const [theme] = useTheme();

    if(color in theme){
        color =  calculateBrightness(theme[color],-0.6,1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(observer.stateListenerEffect(name,setValue),[]);
    return <Horizontal {...props} style={{color:color,...style}}>{value}</Horizontal>
}