import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import {useObserverListener} from "components/useObserver";
import {useState} from "react";
import {isNullOrUndefined} from "components/utils";
import {handleDragOverControlComponent} from "module/page-builder/designer/handleDragOverControlComponent";
import InputDate from "components/input/InputDate";

export default function DateInputController({
                                                data,
                                                formControl,
                                                $selectedController,
                                                setSelectedController,
                                                ...controllerProps
                                            }) {
    const {id, children, type, parentIds, width, ...props} = data;
    const [isHovered, setHovered] = useState(false);
    const [isFocused, setFocused] = useState(false);
    useObserverListener($selectedController, selectedController => {
        if (isNullOrUndefined(selectedController)) {
            return setFocused(false);
        }
        setFocused(selectedController.id === id);
    });
    return <Vertical onDragOver={handleDragOverControlComponent()} p={2} pT={1} pB={1} width={width}>
        <Controller render={InputDate}
                    control={formControl}
                    name={"date"}
                    label={"Date"}
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
                    }} {...controllerProps} {...props}/>
    </Vertical>
}