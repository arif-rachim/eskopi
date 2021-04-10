import useObserver, {useObserverListener, useObserverMapper} from "components/useObserver";
import Select from "components/input/Select";

export default function SelectCellRenderer({
                                               $tableData,
                                               rowIndex,
                                               colIndex,
                                               field,
                                               onChange,
                                               $columns,
                                               ...props
                                           }) {
    const $selectedTable = $columns.current[field].$data;
    const dataToLabel = $columns.current[field].dataToLabel;
    const $value = useObserverMapper($tableData, tableData => {
        if (tableData && tableData[rowIndex] && tableData[rowIndex][field]) {
            return tableData[rowIndex][field];
        }
        return undefined;
    });
    const [$data, setData] = useObserver($selectedTable?.current);
    useObserverListener($selectedTable, newTable => {
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = null;
            return nextValue;
        });
        setData(newTable);
    });
    return <Select $value={$value} onChange={value => {
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = value;
            return nextValue;
        });
    }} $data={$data} dataToLabel={dataToLabel}/>
}