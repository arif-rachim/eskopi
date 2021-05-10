import {useObserverMapper} from "components/useObserver";
import Input from "components/input/Input";

export default function InputCellRenderer({$tableData, rowIndex, colIndex, field, onChange, $columns, ...props}) {
    const $value = useObserverMapper($tableData, tableData => {
        if (tableData && tableData[rowIndex] && tableData[rowIndex][field]) {
            return tableData[rowIndex][field];
        }
        return undefined;
    });
    return <Input $value={$value} onChange={value => {
        onChange((oldValue) => {
            const nextValue = {...oldValue};
            nextValue[field] = value;
            return nextValue;
        });
    }}/>
}