import {Horizontal, Vertical} from "components/layout/Layout";

export default function Panel({headerTitle, headerRenderer, children, ...props}) {
    const HeaderRenderer = headerRenderer;
    return <Vertical flex={1} color={"light"} brightness={0} bB={3}>
        <Horizontal color={"light"} brightness={-1} bB={2} p={1} vAlign={'center'}>
            <Vertical fSize={14} style={{fontWeight: 'bold'}}>
                {headerTitle}
            </Vertical>
            <Horizontal flex={1}/>
            {HeaderRenderer &&
            <HeaderRenderer {...props}/>
            }
        </Horizontal>
        <Vertical height={'100%'} color={"light"} brightness={0} overflow={'auto'}>
            {children}
        </Vertical>
    </Vertical>
}