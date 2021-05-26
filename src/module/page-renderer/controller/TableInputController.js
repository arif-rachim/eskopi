import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import Table from "components/table/Table";


export default function TableInputController({
                                                 data,
                                                 control,
                                                 containerProps,
                                                 style,
                                                 ...controllerProps
                                             }) {
    const {children, type, parentIds, width, ...props} = data;
    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={Table}
                    labelContainerElement={'div'}
                    control={control}
                    style={style}
                    {...controllerProps} {...props} name={data?.dataFieldName}/>
    </Vertical>
}