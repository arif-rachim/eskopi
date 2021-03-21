import Table from "components/table/Table";
import {useObserverListener, useObserverMapper} from "components/useObserver";

export default function TableInput({
                                       name,
                                       onChange,
                                       dataKey,
                                       $data,
                                       domRef,
                                       $value,
                                       $errors,
                                       ...props
                                   }) {
    const $nameValue = useObserverListener($value, value => (name && name in value) ? value[name] : undefined);
    const $errorValue = useObserverMapper($errors, value => (name && name in value) ? value[name] : undefined);
    return <Table onChange={onChange} dataKey={dataKey} $data={$data} domRef={domRef} $value={$nameValue}
                  $error={$errorValue} {...props}/>
}