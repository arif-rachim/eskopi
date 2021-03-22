import Table from "components/table/Table";
import {useObserverMapper} from "components/useObserver";
import {mapToNameFactory} from "components/input/Input";

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
    const $nameValue = useObserverMapper($value, mapToNameFactory(name));
    const $errorValue = useObserverMapper($errors, mapToNameFactory(name));
    return <Table onChange={onChange} dataKey={dataKey} $data={$data} domRef={domRef} $value={$nameValue}
                  $error={$errorValue} {...props}/>
}
