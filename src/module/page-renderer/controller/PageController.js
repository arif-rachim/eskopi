import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import Page from "components/page/Page";

export default function PageController({
                                           data,
                                           control,
                                           containerProps,
                                           style,
                                           ...controllerProps
                                       }) {
    const {children, page, type, parentIds, width, ...props} = data;
    return <Vertical p={2} pT={1} pB={1} width={width} {...containerProps}>
        <Controller render={Page}
                    pageId={page?.id}
                    control={control}
                    {...controllerProps} {...props} />
    </Vertical>
}