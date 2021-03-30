import useObserver, {ObserverValue, useObserverListener} from "components/useObserver";
import useForm from "components/useForm";
import {isNullOrUndefined} from "components/utils";
import Panel from "components/panel/Panel";
import {ControlPropertiesCatalog} from "module/page-designer/controls/ControllerMapper"
import CollapsiblePanel from "components/panel/CollapsiblePanel";

/**
 @param {useRef} inputRef
 * @param {string} name
 * @param {{current:boolean}} $disabled
 * @param {string} className
 * @param {string} color
 * @param {Object} style
 * @param {string} type
 * @param {boolean} autoCaps - indicate to enable autoCaps
 * @type {{common: {}, space: {layout: [string, string], name: string}}}
 */
export default function PropertiesPanel({$layout, setLayout, $selectedController}) {

    const [$propertiesPanel, setPropertiesPanel] = useObserver([]);
    const {control, reset, $value} = useForm();
    useObserverListener($value, (value) => {
        const selectedController = $selectedController.current;
        if (isNullOrUndefined(value) || isNullOrUndefined(selectedController)) {
            return;
        }
        const parentIds = selectedController.parentIds;
        setLayout(layout => {
            const newLayout = JSON.parse(JSON.stringify(layout));
            let nodeToUpdate = newLayout;
            for (const pathId of parentIds) {
                nodeToUpdate = nodeToUpdate?.children?.find(c => c.id === pathId);
            }
            if (nodeToUpdate === undefined) {
                return layout;
            }
            nodeToUpdate = nodeToUpdate?.children?.find(c => c.id === selectedController.id);
            Object.keys(value).forEach(key => {

                nodeToUpdate[key] = value[key];
            });
            return newLayout;
        });
    });
    useObserverListener($selectedController, (selectedController) => {
        if (isNullOrUndefined(selectedController)) {
            reset({});
            return;
        }
        setPropertiesPanel(ControlPropertiesCatalog[selectedController.type] || []);
        reset(selectedController);
    });
    // ok lets do something here /// lets render the properties over here !

    return <Panel headerTitle={'Properties'} height={'100%'}>
        <ObserverValue $observers={$propertiesPanel}>
            {(value) => {
                return value.map((Panel, index) => {
                    return <CollapsiblePanel key={index} height={'unset'} headerTitle={Panel.title}>
                        <Panel control={control} $selectedController={$selectedController}/>
                    </CollapsiblePanel>
                });
            }}
        </ObserverValue>

    </Panel>

}

