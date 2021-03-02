import Panel from "../../../components/panel/Panel";
import Tree from "components/tree/Tree";
import {Horizontal, Vertical} from "components/layout/Layout";
import {useObserverMapper} from "components/useObserver";
import {ControlsNaming} from "module/page-builder/controls/ControllerMapper";

export default function OutlinePanel({$data, setData, $selectedController, setSelectedController}) {
    return <Panel headerTitle={'Outline'}>
        <Tree $data={useObserverMapper($data, data => data.children)}
              $selectedItem={$selectedController}
              setSelectedItem={setSelectedController}
              itemRenderer={OutlineItemRenderer}
              setData={setData}
        />
    </Panel>
}


function OutlineItemRenderer(props) {

    return <Horizontal>
        <Vertical vAlign={'center'} pT={0.5} flex={1}>
            {ControlsNaming[props.data.type]}
        </Vertical>
    </Horizontal>

}