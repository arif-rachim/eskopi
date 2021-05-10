import {Vertical} from "components/layout/Layout";
import {Controller} from "components/useForm";
import Input from "components/input/Input";
import Select from "components/input/Select";
import useObserver from "components/useObserver";
import Checkbox from "components/input/Checkbox";

function SelectController({name, title, control, data}) {
    const [$data] = useObserver(data);
    return <Controller label={title}
                       horizontalLabelPositionWidth={60}
                       render={Select}
                       name={name}
                       flex={'1 0 auto'}
                       control={control}
                       $data={$data}
    />;
}

export default function dynamicPropertiesPanelFactory({title = 'Event Panel', properties = {}}) {
    function DynamicPropertiesPanel({control, $selectedController, $selectedPage}) {
        return <Vertical p={2} gap={2}>
            {Object.keys(properties).map(key => {
                const prop = properties[key];
                const {type, data} = prop;
                if (type === 'select') {
                    return <SelectController
                        key={key}
                        name={key}
                        title={prop.title}
                        control={control}
                        data={data}/>
                }
                if (type === 'number') {
                    return <Controller key={key} label={prop.title} horizontalLabelPositionWidth={60}
                                       render={Number} name={key} flex={'1 0 auto'}
                                       control={control}
                    />
                }
                if (type === 'boolean') {
                    return <Controller key={key} label={prop.title} horizontalLabelPositionWidth={60}
                                       render={Checkbox} name={key} flex={'1 0 auto'}
                                       control={control}
                    />
                }
                return <Controller key={key} label={prop.title} horizontalLabelPositionWidth={60}
                                   render={Input} name={key} flex={'1 0 auto'}
                                   casing={prop.casing}
                                   control={control}
                />
            })}
        </Vertical>
    }

    DynamicPropertiesPanel.title = title;
    return DynamicPropertiesPanel;
}