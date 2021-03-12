import {Horizontal, Vertical} from "components/layout/Layout";

export default function SidePanel({headerTitle, headerRenderer, children, ...props}) {
    const HeaderRenderer = headerRenderer;
    return <Horizontal height={'100%'} color={"light"} brightness={0} bB={3}>
        <Vertical color={"light"} brightness={-1} bB={2} p={1} vAlign={'top'} width={25} pT={2} pB={2} pR={2}>
            <Horizontal fSize={14}
                        style={{fontWeight: 'bold', transform: 'rotate(-90deg)', transformOrigin: 'bottom right'}}>
                {!HeaderRenderer &&
                <Horizontal>{headerTitle}</Horizontal>
                }
                {HeaderRenderer &&
                <HeaderRenderer {...props}/>
                }
            </Horizontal>
        </Vertical>
        <Vertical color={"light"} brightness={0} overflow={'auto'} style={{display: 'block'}} flex={'1 0 auto'}>
            {children}
        </Vertical>
    </Horizontal>
}