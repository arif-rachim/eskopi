import GroupTemplate from "module/page-designer/controls/controller/GroupTemplate";

export default function FormTemplate({
                                         data,
                                         control,
                                         $selectedController,
                                         setSelectedController,
                                         containerProps,
                                         style,
                                         ...controllerProps
                                     }) {
    return <GroupTemplate style={style}
                          data={data}
                          containerProps={containerProps}
                          setSelectedController={setSelectedController}
                          $selectedController={$selectedController}
                          control={control}
                          element={'form'}
                          {...controllerProps}
    />
}
