import Page from "components/page/Page";


export default function PageRenderer({params, setTitle}) {
    const [pageId] = params;
    return <Page
        pageId={pageId}
        setTitle={setTitle}/>
}


