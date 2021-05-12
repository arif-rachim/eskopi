import useObserver, {useObserverMapper} from "components/useObserver";
import {mapToNameFactory} from "components/input/Input";
import Table from "components/table/Table";

export default function InputTable({dataKey, name, $columns, $errors, domRef, $value, onChange, ...props}) {
    const $nameValue = useObserverMapper($value, mapToNameFactory(name));
    // eslint-disable-next-line
    const $errorValue = useObserverMapper($errors, mapToNameFactory(name));
    const [$selectedRow, setSelectedRow] = useObserver();
    return <Table $data={$nameValue}
                  $value={$selectedRow}
                  domRef={domRef}
                  dataKey={dataKey}
                  $errors={$errorValue}
                  onChange={setSelectedRow}
                  $columns={$columns}
                  onDataChange={onChange}/>
}