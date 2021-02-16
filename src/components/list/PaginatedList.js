import List from "components/list/List";
import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver, {useObserverListener} from "components/useObserver";
import Label from "components/label/Label";
import Button from "components/button/Button";

function updateStartEndIndex(page, rowPerPage, totalRow, setEndIndex, setStartIndex) {
    let endIndex = page * rowPerPage;
    const startIndex = endIndex - rowPerPage;
    if (endIndex > totalRow) {
        endIndex = totalRow;
    }
    setEndIndex(endIndex);
    setStartIndex(startIndex);
}

export default function PaginatedList({
                                          $data,
                                          itemRenderer,
                                          dataKey,
                                          onKeyboardDown,
                                          onKeyboardUp,
                                          rowPerPage = 5,
                                          ...props
                                      }) {
    const [$totalRow, setTotalRow] = useObserver($data?.current?.length ? $data.current.length : 0);
    const [$currentPage, setCurrentPage] = useObserver(1);
    const [$startIndex, setStartIndex] = useObserver(0);
    const [$endIndex, setEndIndex] = useObserver(0);
    const [$listData, setListData] = useObserver([]);

    useObserverListener($startIndex, (startIndex) => {
        setListData($data.current.slice(startIndex, $endIndex.current));
    });
    useObserverListener($endIndex, (endIndex) => {
        setListData($data.current.slice($startIndex.current, endIndex));
    });
    useObserverListener($totalRow, (totalRow) => {
        updateStartEndIndex($currentPage.current, rowPerPage, totalRow, setEndIndex, setStartIndex);
    });
    useObserverListener($currentPage, (page) => {
        updateStartEndIndex(page, rowPerPage, $totalRow.current, setEndIndex, setStartIndex);
    });
    useObserverListener($data, (data) => {
        setCurrentPage(1);
        setTotalRow(data ? data.length : 0);
    });
    return <Vertical>
        <List $data={$listData} itemRenderer={itemRenderer} dataKey={dataKey} onKeyboardDown={onKeyboardDown}
              onKeyboardUp={onKeyboardUp} {...props}/>
        <Horizontal>
            <Button onClick={() => {
                setCurrentPage(oldPage => oldPage > 1 ? oldPage - 1 : oldPage)
            }}>Prev</Button>
            <Button onClick={() => {
                setCurrentPage(oldPage => oldPage * rowPerPage < $totalRow.current ? oldPage + 1 : oldPage)
            }}>Next</Button>
            <Horizontal flex={1}/>
            <Horizontal gap={1}>
                <Label $value={$startIndex}/>
                <Horizontal>{'-'}</Horizontal>
                <Label $value={$endIndex}/>
                <Horizontal>{'of'}</Horizontal>
                <Label $value={$totalRow}/>
            </Horizontal>
        </Horizontal>
    </Vertical>
}