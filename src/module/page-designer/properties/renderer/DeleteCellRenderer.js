import Button from "components/button/Button";

export default function DeleteCellRenderer({$tableData, rowIndex, colIndex, field, onChange, $columns, ...props}) {
    return <Button type={'button'} onClick={() => {

        const changeFilter = $columns.current[field].onChange;
        changeFilter(oldField => {
            const newField = [...oldField];
            newField.splice(rowIndex, 1);
            return newField;
        })
    }}>❌</Button>
}