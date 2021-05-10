import useObserver, {useObserverListener} from "components/useObserver";
import {createContext, useContext, useEffect, useRef} from "react";

const ControlRegistrationContext = createContext([]);

export function ControlRegistrationContextProvider({children, onChange}) {
    const controlRegistration = useObserver({});
    useObserverListener(controlRegistration[0], registeredControls => {
        if (onChange) {
            onChange(registeredControls);
        }
    })
    return <ControlRegistrationContext.Provider value={controlRegistration}>
        {children}
    </ControlRegistrationContext.Provider>
}

export function useRegisteredControlsObserver() {
    const [$controls] = useContext(ControlRegistrationContext);
    return $controls;
}

export function useControlRegistrationContextSetter() {
    return useContext(ControlRegistrationContext)[1];
}

export function useControlRegistration({id, name, actions}) {
    const [, setControls] = useContext(ControlRegistrationContext);
    const actionsRef = useRef(actions);
    actionsRef.current = actions;
    useEffect(() => {
        setControls(controls => {
            const control = {...controls[id]};
            control.actions = control.actions || [];
            control.name = name;
            control.actions = [...control.actions, actionsRef];
            return {...controls, [id]: control};
        });
        return () => {
            setControls(controls => {
                const control = {...controls[id]};
                control.actions = control.actions.filter(action => action !== actionsRef);
                return {...controls, [id]: control}
            });
        };
    }, [id, name, setControls]);
}