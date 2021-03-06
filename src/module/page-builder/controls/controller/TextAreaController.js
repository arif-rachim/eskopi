import {Controller} from "components/useForm";
import {Vertical} from "components/layout/Layout";
import TextArea from "components/input/TextArea";
import {useObserverListener} from "components/useObserver";
import {useState} from "react";
import {isNullOrUndefined} from "components/utils";
import {handleDragOverControlComponent} from "module/page-builder/designer/handleDragOverControlComponent";

export default function TextAreaController({
                                               data,
                                               formController,
                                               $selectedController,
                                               setSelectedController,
                                               ...controllerProps
                                           }) {
    const {id, children, type, parentIds, ...props} = data;
    const [isHovered, setHovered] = useState(false);
    const [isFocused, setFocused] = useState(false);
    useObserverListener($selectedController, selectedController => {
        if (isNullOrUndefined(selectedController)) {
            return setFocused(false);
        }
        setFocused(selectedController.id === id);
    });
    return <Vertical onDragOver={handleDragOverControlComponent()} p={2} pT={1} pB={1}>
        <Controller render={TextArea} rows={3} label={"Text Area"} controller={formController}
                    name={"textarea"} disabled={false}
                    style={{
                        border: isFocused ? '1px solid blue' : isHovered ? `1px solid green` : '1px solid rgba(0,0,0,0.2)',
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
                    autoComplete={'off'}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (setSelectedController) {
                            setSelectedController(data);
                        }
                    }} {...controllerProps} {...props}/>
    </Vertical>
}