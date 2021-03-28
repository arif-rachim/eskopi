import {useObserverListener} from "components/useObserver";
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
        const [isHovered, setHovered] = useState(false);
        const [isFocused, setFocused] = useState(false);
        const {$selectedController, setSelectedController} = controllerProps;
        useObserverListener($selectedController, selectedController => {
            if (isNullOrUndefined(selectedController)) {
                return setFocused(false);
            }
            setFocused(selectedController.id === id);
        });
        const classNames = [];
        if (isFocused) {
            classNames.push(style.onFocus);
        } else if (isHovered) {
            classNames.push(style.onHover);
        } else {
            classNames.push(style.onEmpty);
        }
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