import GroupController from "module/page-renderer/controller/GroupController";

export default function FormController({
                                           data,
                                           control,
                                           style,
                                           containerProps,
                                           ...controllerProps
                                       }) {

    return <GroupController data={data}
                            control={control}
                            style={style}
                            element={'form'}
                            containerProps={containerProps}
                            {...controllerProps}
    />
}
