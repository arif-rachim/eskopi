import {Vertical} from "components/layout/Layout";
import useObserver, {useObserverListener} from "components/useObserver";
import List from "components/list/List";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import {camelCaseToSentenceCase} from "components/utils";
import {Controls} from "module/page-builder/controls/ControlListPanel";
import Select from "components/input/Select";

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
        padding: {
            type: 'number',
            defaultValue: undefined
        },
        paddingLeft: {
            type: 'number',
            defaultValue: undefined
        },
        paddingRight: {
            type: 'number',
            defaultValue: undefined
        },
        paddingTop: {
            type: 'number',
            defaultValue: undefined
        },
        paddingBottom: {
            type: 'number',
            defaultValue: undefined
        },

        margin: {
            type: 'number',
            defaultValue: undefined
        },
        marginLeft: {
            type: 'number',
            defaultValue: undefined
        },
        marginRight: {
            type: 'number',
            defaultValue: undefined
        },
        marginTop: {
            type: 'number',
            defaultValue: undefined
        },
        marginBottom: {
            type: 'number',
            defaultValue: undefined
        },

        border: {
            type: 'number',
            defaultValue: undefined
        },
        borderLeft: {
            type: 'number',
            defaultValue: undefined
        },
        borderRight: {
            type: 'number',
            defaultValue: undefined
        },
        borderTop: {
            type: 'number',
            defaultValue: undefined
        },
        borderBottom: {
            type: 'number',
            defaultValue: undefined
        },

        radius: {
            type: 'number',
            defaultValue: undefined
        },
        radiusLeft: {
            type: 'number',
            defaultValue: undefined
        },
        radiusRight: {
            type: 'number',
            defaultValue: undefined
        },
        radiusTop: {
            type: 'number',
            defaultValue: undefined
        },
        radiusBottom: {
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
        }
    }
}
export default function PropertiesPanel({$layout, setLayout, $selectedController}) {

    const [$listData, setListData] = useObserver();
    const {controller: formController, reset, $value} = useForm();
    useObserverListener($value, (value) => {
        const selectedController = $selectedController.current;
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
    return <Vertical color={'light'} brightness={1} height={'100%'} overflow={'auto'}>

        <List $data={$listData} dataKey={data => data.label} formController={formController}
              itemRenderer={PropertyItemRenderer}/>

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
    return <Vertical color={"light"} brightness={-0.5} p={1} pB={0.5} pT={0.5}>
        <Controller controller={formController}
                    render={Render}
                    label={camelCaseToSentenceCase(data.label)}
                    name={data.label}
                    {...props}
        />
    </Vertical>
}