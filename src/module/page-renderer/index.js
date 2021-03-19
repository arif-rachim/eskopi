import {Vertical} from "../../components/layout/Layout";
import useResource, {useResourceListener} from "components/useResource";
import {SYSTEM_PAGE_DESIGNS, SYSTEM_PAGES} from "components/SystemTableName";
import useObserver, {ObserverValue, useObserverMapper} from "components/useObserver";
import useForm from "components/useForm";
import {ControllerMapper} from "module/page-renderer/ControllerMapper";

export default function PageRenderer(props) {
    const [pageId] = props.params;
    const [$onPageDesignLoad] = useResource({url: `/db/${SYSTEM_PAGE_DESIGNS}`, data: {pageId}});
    const [$onPageLoad] = useResource({url: `/db/${SYSTEM_PAGES}`});
    const [$pageDesign, setPageDesign] = useObserver();
    useResourceListener($onPageDesignLoad, (status, pageDesign) => {
        if (status === 'success') {
            if (pageDesign.length > 0) {
                setPageDesign(pageDesign[0]);
            }
        }
    });
    useResourceListener($onPageLoad, (status, pageInfo) => {
        if (status === 'success') {
            const pageInfoDetail = (pageInfo) => {
                for (const pageInfoElement of pageInfo) {
                    if (pageInfoElement.id === pageId) {
                        return pageInfoElement;
                    }
                    if (pageInfoElement.children && pageInfoElement.children.length > 0) {
                        const detail = pageInfoDetail(pageInfoElement.children);
                        if (detail) {
                            return detail;
                        }
                    }
                }
                return undefined;
            }
            const detail = pageInfoDetail(pageInfo);
            if (detail) {
                // we need to set the title to perent here !
                debugger;
            }
        }
    })
    const {control} = useForm();
    return <Vertical>
        <ObserverValue $observers={useObserverMapper($pageDesign, data => data?.children)}>{
            (children) => {
                children = children || [];
                return children.map(child => {
                    const ChildRender = ControllerMapper[child.type];
                    return <ChildRender key={child.id} data={child} control={control}/>
                });
            }
        }</ObserverValue>
    </Vertical>
}


