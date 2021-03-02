import {Controller} from "components/useForm";
import Input from "components/input/Input";
import {Vertical} from "components/layout/Layout";
import {useObserverListener} from "components/useObserver";
import {useState} from "react";
import {isNullOrUndefined} from "components/utils";
import {handleDragOverControlComponent} from "module/page-builder/designer/handleDragOverControlComponent";

export default function TextInputController({
                                                data,
                                                formController,
                                                $selectedController,
                                                setSelectedController,
                                                ...controllerProps
                                            }) {
    const {id, children, type, parentIds, ...props} = data;
    const [isFocused, setFocused] = useState(false);
    useObserverListener($selectedController, selectedController => {
        if (isNullOrUndefined(selectedController)) {
            return setFocused(false);
        }
        setFocused(selectedController.id === id);
    });
    return <Vertical onDragOver={handleDragOverControlComponent()} p={2} pT={1} pB={1}>
        <Controller render={Input} type={"input"} label={"Input"} controller={formController}
                    name={"input"} disabled={false}
                    autoComplete={'off'}
                    style={{
                        backgroundColor: isFocused ? 'rgba(152,224,173,0.5)' : 'rgba(255,255,255,1)',
                        transition: 'all 100ms cubic-bezier(0,0,0.7,0.9)'
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