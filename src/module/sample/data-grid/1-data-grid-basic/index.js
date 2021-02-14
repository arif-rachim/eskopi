import {Vertical} from "../../../../components/layout/Layout";
import style from "./Table.module.css";

const array = Array.from({length: 100});

export default function DataGridSample() {
    return <Vertical overflow={'auto'} height={'100%'}>
        <table className={style.styledTable}>
            <thead>
            <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Age</th>
            </tr>
            </thead>
        </table>
        <Vertical height={'100%'} overflow={'auto'}>
            <table className={style.styledTable}>
                <tbody>
                {array.map((_, index) => {
                    return <tr key={index}>
                        <td>Jill</td>
                        <td>Smith</td>
                        <td>50</td>
                    </tr>
                })}
                </tbody>
            </table>
        </Vertical>
    </Vertical>
}