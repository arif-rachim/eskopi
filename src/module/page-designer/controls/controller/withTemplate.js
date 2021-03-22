import {useObserverListener} from "components/useObserver";
import {isNullOrUndefined} from "components/utils";
import {handleDragOverControlComponent} from "module/page-designer/designer/handleDragOverControlComponent";
import {useState} from "react";

export default function withTemplate(Component) {
    return function ControlledComponent({
                                            data,
                                            formControl,
                                            $selectedController,
                                            setSelectedController,
                                            ...controllerProps
                                        }) {
        const {id} = data;
        const [isHovered, setHovered] = useState(false);
        const [isFocused, setFocused] = useState(false);
        useObserverListener($selectedController, selectedController => {
            if (isNullOrUndefined(selectedController)) {
                return setFocused(false);
            }
            setFocused(selectedController.id === id);
        });

        return <Component data={data} control={formControl}
                          containerProps={{
                              onDragOver: handleDragOverControlComponent()
                          }}
                          style={{
                              border: isFocused ? '1px solid blue' : isHovered ? '1px solid green' : '1px solid rgba(0,0,0,0.2)',
                              transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)'
                          }}
                          onMouseEnter={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              setHovered(true);
                          }}
                          onMouseLeave={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              setHovered(false);
                          }}
                          onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (setSelectedController) {
                                  setSelectedController(data);
                              }
                          }}
                          {...controllerProps}
        />
    }
}