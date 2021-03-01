import {Vertical} from "components/layout/Layout";
import useObserver, {useObserverListener} from "components/useObserver";
import List from "components/list/List";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import {camelCaseToSentenceCase, isNullOrUndefined} from "components/utils";
import {Controls} from "module/page-builder/controls/ControlListPanel";
import Select from "components/input/Select";
import Panel from "components/panel/Panel";

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


const controllerPropertiesCatalog = {
    common: {
        p: {
            type: 'number',
            defaultValue: undefined
        },
        pL: {
            type: 'number',
            defaultValue: undefined
        },
        pR: {
            type: 'number',
            defaultValue: undefined
        },
        pT: {
            type: 'number',
            defaultValue: undefined
        },
        pB: {
            type: 'number',
            defaultValue: undefined
        },
        m: {
            type: 'number',
            defaultValue: undefined
        },
        mL: {
            type: 'number',
            defaultValue: undefined
        },
        mR: {
            type: 'number',
            defaultValue: undefined
        },
        mT: {
            type: 'number',
            defaultValue: undefined
        },
        mB: {
            type: 'number',
            defaultValue: undefined
        },

        b: {
            type: 'number',
            defaultValue: undefined
        },
        bL: {
            type: 'number',
            defaultValue: undefined
        },
        bR: {
            type: 'number',
            defaultValue: undefined
        },
        bT: {
            type: 'number',
            defaultValue: undefined
        },
        bB: {
            type: 'number',
            defaultValue: undefined
        },

        r: {
            type: 'number',
            defaultValue: undefined
        },
        rTL: {
            type: 'number',
            defaultValue: undefined
        },
        rTR: {
            type: 'number',
            defaultValue: undefined
        },
        rBL: {
            type: 'number',
            defaultValue: undefined
        },
        rBR: {
            type: 'number',
            defaultValue: undefined
        },
    },
    [Controls.TEXT_INPUT]: {
        name: {
            type: 'string',
            defaultValue: ''
        },
    },
    [Controls.TEXT_AREA]: {
        name: {
            type: 'string',
            defaultValue: ''
        },
    },
    [Controls.BUTTON]: {
        name: {
            type: 'string',
            defaultValue: ''
        },
    },
    [Controls.SPACE]: {
        layout: {
            type: 'select',
            data: ['vertical', 'horizontal'],
            defaultValue: 'vertical'
        },
        vAlign: {
            type: 'select',
            data: ['top', 'center', 'bottom'],
            defaultValue: ''
        },
        hAlign: {
            type: 'select',
            data: ['left', 'center', 'right'],
            defaultValue: ''
        },
    }
}
export default function PropertiesPanel({$layout, setLayout, $selectedController}) {

    const [$listData, setListData] = useObserver();
    const {controller: formController, reset, $value} = useForm();
    useObserverListener($value, (value) => {
        const selectedController = $selectedController.current;
        if (isNullOrUndefined(value) || isNullOrUndefined(selectedController)) {
            return;
        }

        const path = selectedController.path;
        setLayout(layout => {
            const newLayout = JSON.parse(JSON.stringify(layout));
            let nodeToUpdate = newLayout;
            for (const pathId of path) {
                nodeToUpdate = nodeToUpdate.children.filter(c => c.id === pathId)[0];
            }
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
    return <Vertical height={'100%'} bL={3} overflow={'auto'}>
        <Panel headerTitle={'Properties'}>
            <List $data={$listData} dataKey={data => data.label} formController={formController}
                  itemRenderer={PropertyItemRenderer}/>
        </Panel>

    </Vertical>
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