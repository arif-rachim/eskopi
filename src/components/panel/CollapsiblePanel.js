import Panel from "components/panel/Panel";
import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver, {ObserverValue} from "components/useObserver";

export default function CollapsiblePanel({headerTitle, ...props}) {
    const [$showCollapsible, setShowCollapsible] = useObserver('true');
    return <Panel title={headerTitle}
                  $showCollapsible={$showCollapsible}
                  setShowCollapsible={setShowCollapsible}
                  headerRenderer={CollapsibleHeaderRenderer}>


        <Vertical $visible={$showCollapsible}>
            {props.children}
        </Vertical>
    </Panel>
}

function CollapsibleHeaderRenderer({title, $showCollapsible, setShowCollapsible}) {

    return <Horizontal onClick={() => setShowCollapsible(collapsible => !collapsible)}>
        <Horizontal flex={'0 0 15px'}>
            <ObserverValue $observer={$showCollapsible} render={({value}) => {
                return value ? <CaretDownIcon/> : <CaretForwardIcon/>
            }}/>
        </Horizontal>
        <Horizontal flex={'1 0 auto'}>
            {title}
        </Horizontal>
    </Horizontal>
}

function CaretForwardIcon() {
    return <svg xmlns='http://www.w3.org/2000/svg' className='ionicon' viewBox='0 0 512 512'>
        <path
            d='M190.06 414l163.12-139.78a24 24 0 000-36.44L190.06 98c-15.57-13.34-39.62-2.28-39.62 18.22v279.6c0 20.5 24.05 31.56 39.62 18.18z'/>
    </svg>
}

function CaretDownIcon() {
    return <svg xmlns='http://www.w3.org/2000/svg' className='ionicon' viewBox='0 0 512 512'>
        <path
            d='M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z'/>
    </svg>
}