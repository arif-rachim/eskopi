import {Horizontal, Vertical} from "components/layout/Layout";

export default function Panel({headerTitle, headerRenderer, height = '100%', children, ...props}) {
    const HeaderRenderer = headerRenderer;
    return <Vertical height={height} color={"light"} brightness={0} bB={3}>
        <Horizontal color={"light"} brightness={-1} bB={2} p={1} vAlign={'center'}>
            <Vertical fSize={14} style={{fontWeight: 'bold'}}>
                {headerTitle}
            </Vertical>

            {HeaderRenderer &&
            <HeaderRenderer {...props}/>
            }
        </Horizontal>
        <Vertical  height={'100%'} overflow={'scroll'}>
        <Vertical color={"light"} brightness={0} overflow={'auto'} style={{display:'block'}}>
            {children}
        </Vertical>
        </Vertical>
    </Vertical>
}