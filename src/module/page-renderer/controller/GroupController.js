import {Horizontal, Vertical} from "components/layout/Layout";
import {ControlForPageRenderer} from "module/page-designer/controls/ControllerMapper";

export default function GroupController({
                                            data,
                                            control,
                                            style,
                                            containerProps,
                                            ...controllerProps
                                        }) {
    const {id, layout, children, type, parentIds, ...props} = data;
    const isHorizontal = layout === 'horizontal';
    const Component = isHorizontal ? Horizontal : Vertical;
    return <Component
        p={0}
        m={0}
        style={{
            minHeight: 30,
            transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)',
            flexWrap: 'wrap'
        }}
        data-id={id}
        data-layout={isHorizontal ? 'horizontal' : 'vertical'}
        {...containerProps}
        {...controllerProps}
        {...props}
    >
        {children.map(child => {
            const ChildRender = ControlForPageRenderer[child.type];
            return <ChildRender key={child.id} data={child} control={control}/>
        })}

    </Component>
}
