import {Horizontal, Vertical} from "components/layout/Layout";

export default function Panel({headerTitle, headerRenderer, height, children, ...props}) {
    const HeaderRenderer = headerRenderer;
    return <Vertical height={height} color={"light"} brightness={0} bB={3}>
        <Horizontal color={"light"} brightness={-1} bB={2} p={1} vAlign={'center'}>
            {HeaderRenderer &&
            <HeaderRenderer {...props}/>
            }
            {!HeaderRenderer &&
            <Vertical fSize={14} style={{fontWeight: 'bold'}}>
                {headerTitle}
            </Vertical>
            }
        </Horizontal>
        <Vertical color={"light"} brightness={0} overflow={'auto'} style={{display: 'block'}} flex={'1 0 auto'}>
            {children}
        </Vertical>
    </Vertical>
}