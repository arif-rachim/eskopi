import {ControlRegistrationContextProvider} from "components/page/useControlRegistration";

export default function withControlRegistration(Component) {
    return function ControlRegistration(props) {
        return <ControlRegistrationContextProvider>
            <Component {...props} />
        </ControlRegistrationContextProvider>
    }
}