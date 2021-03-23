import {Horizontal, Vertical} from "components/layout/Layout";
import {RenderLayout} from "module/page-designer/designer/DesignerPanel";
import {getPlaceHolder} from "module/page-designer/designer/getPlaceHolder";
import {handleDragOverControlComponent} from "module/page-designer/designer/handleDragOverControlComponent";

export default function GroupTemplate({
                                          data,
                                          control,
                                          $selectedController,
                                          setSelectedController,
                                          containerProps,
                                          style,
                                          ...controllerProps
                                      }) {
    const {id, layout, children, type, parentIds, ...props} = data;
    const isHorizontal = layout === 'horizontal';
    const Component = isHorizontal ? Horizontal : Vertical;
    return <Component
        onDragOver={handleDragOverControlComponent}
        p={0}
        m={0}
        style={{
            minHeight: 30,
            flexWrap: 'wrap',
            ...style
        }}
        data-id={id}
        onDragEnter={(event) => {
            const placeHolder = getPlaceHolder({display: 'block'});
            event.preventDefault();
            event.stopPropagation();
            if (placeHolder.parentElement !== event.currentTarget) {
                event.currentTarget.append(placeHolder);
            }
        }}
        data-layout={isHorizontal ? 'horizontal' : 'vertical'}
        {...controllerProps}
        {...props}
    >
        <RenderLayout value={children} control={control}
                      $selectedController={$selectedController}
                      setSelectedController={setSelectedController}/>

    </Component>
}
