import {Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Select from "components/input/Select";
import useObserver from "components/useObserver";
import useResource, {useResourceListener} from "components/useResource";
import {useEffect} from "react";
import {SYSTEM_PAGES} from "components/SystemTableName";

function PageSelectorPanel({control}) {
    const [$pageData, setPageData] = useObserver([]);
    const [$loadPageResource, setLoadPageResource] = useResource();
    useEffect(() => {
        setLoadPageResource(`/db/${SYSTEM_PAGES}`, {});
    }, [setLoadPageResource]);
    useResourceListener($loadPageResource, (status, resource) => {
        if (status === 'success') {
            const arrayResource = treeToArray(resource);
            setPageData(arrayResource);
        }
    })
    return <Vertical p={2} gap={2}>
        <Controller label={'Page'}
                    horizontalLabelPositionWidth={60}
                    render={Select} name={'page'}
                    $data={$pageData}
                    dataKey={data => data}
                    control={control}
                    dataToLabel={data => data?.name}
                    containerStyle={{width: '100%'}}
        />
    </Vertical>
}

function treeToArray(array) {
    let result = [];
    for (const child of array) {
        if ('children' in child && child.children.length > 0) {
            result = result.concat(treeToArray(child.children));
        } else {
            result.push(child)
        }
    }
    return result;
}

PageSelectorPanel.title = 'Page Selector';
export default PageSelectorPanel;