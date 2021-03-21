import Table from "components/table/Table";
import {useObserverListener} from "components/useObserver";

export default function TableInput({
                                       name,
                                       onChange,
                                       dataKey,
                                       $data,
                                       domRef,
                                       $value,
                                       ...props
                                   }) {
    const $nameValue = useObserverListener($value, value => value[name]);
    return <Table onChange={onChange} dataKey={dataKey} $data={$data} domRef={domRef} $value={$nameValue} {...props}/>
}