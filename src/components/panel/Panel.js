import {Horizontal, Vertical} from "components/layout/Layout";

export default function Panel({headerTitle, headerRenderer, $visible, height, flex, children, ...props}) {
    const HeaderRenderer = headerRenderer;
    return <Vertical height={height} color={"light"} brightness={0} bB={3} flex={flex} $visible={$visible}>
        <Horizontal color={"light"} brightness={-1} bB={2} p={1} vAlign={'center'}>
            <Vertical fSize={14} style={{fontWeight: 'bold'}} flex={'1 0 auto'}>
                {!HeaderRenderer && <Horizontal>{headerTitle}</Horizontal>}
                {HeaderRenderer &&
                <HeaderRenderer {...props}/>
                }
            </Vertical>

        </Horizontal>
        <Vertical color={"light"} brightness={0} overflow={'auto'} style={{display: 'block'}} flex={'1 0 auto'}>
            {children}
        </Vertical>
    </Vertical>
}