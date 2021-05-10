import Page from "components/page/Page";
import {Vertical} from "components/layout/Layout";

export default function PageRenderer({params, setTitle}) {
    const [pageId] = params;
    return <Vertical height={'100%'} overflow={'auto'}><Page
        pageId={pageId}
        setTitle={setTitle}/></Vertical>
}


