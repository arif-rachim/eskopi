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
    // If you are updating actions of FormController please ensure you also update the FormController.js
    useControlRegistration({
        controllerName: data?.controllerName,
        id: data?.id,
        actions: {
            getValue: () => {
            },
            reset: (initialValue) => {
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
