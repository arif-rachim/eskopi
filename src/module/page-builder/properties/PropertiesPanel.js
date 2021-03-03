import {Vertical} from "components/layout/Layout";
import useObserver, {useObserverListener} from "components/useObserver";
import List from "components/list/List";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import {camelCaseToSentenceCase, isNullOrUndefined} from "components/utils";
import Select from "components/input/Select";
import Panel from "components/panel/Panel";
import {controllerPropertiesCatalog} from "module/page-builder/controls/ControllerMapper"

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

    const [$listData, setListData] = useObserver();
    const {controller: formController, reset, $value} = useForm();
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
            nodeToUpdate = nodeToUpdate?.children?.find(c => c.id === selectedController.id);
            Object.keys(value).forEach(key => {
                nodeToUpdate[key] = value[key];
            })
            return newLayout;
        });
    });
    useObserverListener($selectedController, (selectedController) => {
        if (isNullOrUndefined(selectedController)) {
            setListData([]);
            reset({});
            return;
        }
        const common = controllerPropertiesCatalog.common;
        const specific = controllerPropertiesCatalog[selectedController.type];
        const controllerProperties = {...common, ...specific};

        let listData = Object.keys(controllerProperties).map(key => ({
            label: key,
            value: selectedController[key],
            ...controllerProperties[key]
        }));

        listData = listData.sort((dataA, dataB) => {
            if (dataA.label < dataB.label) {
                return -1;
            }
            if (dataA.label > dataB.label) {
                return 1;
            }
            return 0;
        })

        setListData(listData);
        reset(selectedController);
    })
    // ok lets do something here /// lets render the properties over here !
    return <Panel headerTitle={'Properties'}>
            <List $data={$listData} dataKey={data => data.label} formController={formController}
                  itemRenderer={PropertyItemRenderer}/>
        </Panel>

}

function PropertyItemRenderer({data, formController}) {
    const type = data.type;
    let Render = Input;
    const props = {
        horizontalLabelPositionWidth: 80
    };
    const [$data] = useObserver(data.data);
    if (type === 'select') {
        Render = Select;
        props.dataKey = data => data;
        props.$data = $data;
    }
    return <Vertical p={1} pB={0.5} pT={0.5}>
        <Controller controller={formController}
                    render={Render}
                    label={camelCaseToSentenceCase(data.label)}
                    name={data.label}
                    {...props}
        />
    </Vertical>
}