import GroupTemplate from "module/page-designer/controls/controller/GroupTemplate";
import {useControlRegistration} from "components/page/useControlRegistration";

export default function FormTemplate({
                                         data,
                                         control,
                                         $selectedController,
                                         setSelectedController,
                                         containerProps,
                                         style,
                                         ...controllerProps
                                     }) {
    useControlRegistration({
        controllerName: data?.controllerName,
        id: data?.id,
        actions: {
            getValue: () => {
            },
            reset: () => {
            }
        }
    });
    return <GroupTemplate style={style}
                          data={data}
                          containerProps={containerProps}
                          setSelectedController={setSelectedController}
                          $selectedController={$selectedController}
                          control={control}
                          element={'div'}
                          {...controllerProps}
    />
}
