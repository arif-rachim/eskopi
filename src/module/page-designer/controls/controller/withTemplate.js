import useObserver, {useObserverListener} from "components/useObserver";
import {isNullOrUndefined} from "components/utils";
import {handleDragOverControlComponent} from "module/page-designer/designer/handleDragOverControlComponent";
import {useState} from "react";
import style from "./WithTemplate.module.css";

export default function withTemplate(Component) {
    return function ControlledComponent({
                                            data,
                                            control,
                                            ...controllerProps
                                        }) {
        const {id} = data;
        const [$isHovered, setHovered] = useObserver(false);
        const [$isFocused, setFocused] = useObserver(false);
        const {$selectedController, setSelectedController} = controllerProps;
        useObserverListener($selectedController, selectedController => {
            if (isNullOrUndefined(selectedController)) {
                return setFocused(false);
            }
            setFocused(selectedController.id === id);
        });
        const [classNames, setClassNames] = useState([]);
        useObserverListener([$isFocused, $isHovered], ([isFocused, isHovered]) => {
            const clazzName = [];
            if (isFocused) {
                clazzName.push(style.onFocus);
            } else if (isHovered) {
                clazzName.push(style.onHover);
            } else {
                clazzName.push(style.onEmpty);
            }
            setClassNames(oldClassName => {
                if (JSON.stringify(oldClassName) !== JSON.stringify(clazzName)) {
                    return clazzName;
                }
                return oldClassName;
            })
        });

        return <Component data={data}
                          control={control}
                          containerProps={{
                              onDragOver: handleDragOverControlComponent()
                          }}
                          className={classNames}
                          style={{
                              transition: 'all 300ms cubic-bezier(0,0,0.7,0.9)'
                          }}
                          onMouseOver={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              setHovered(event.currentTarget.getAttribute('data-id') === id);
                          }}
                          onMouseOut={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              setHovered(event.currentTarget.getAttribute('data-id') !== id);
                          }}
                          onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (setSelectedController) {
                                  setSelectedController(data);
                              }
                          }}
                          data-id={id}
                          {...controllerProps}
        />
    }
}