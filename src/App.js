import {ThemeContextProvider} from "./components/useTheme";
import {LayerContextProvider} from "./components/useLayers";
import useRouter, {RouterProvider} from "./components/useRouter";
import {Suspense} from "react";
import LoginScreen from "module/login";
import RegistrationScreen from "module/registration";
import {AuthCheck, UserProvider} from "components/authentication/useUser";
import ErrorBoundary from "components/error-boundary/ErrorBoundary"
import AppShell from "components/app-shell/AppShell";

function App() {
    const Element = useRouter();
    if (Element.Element === RegistrationScreen) {
        return <Element.Element {...Element.params}/>;
    }
    return <AuthCheck fallback={<LoginScreen/>}>
        <Element.Element {...Element.params}/>
    </AuthCheck>
}

export default function Provider() {
    return (<UserProvider>
        <ThemeContextProvider>
            <RouterProvider>
                <LayerContextProvider>
                    <AppShell>
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading ...</div>}>
                                <App/>
                            </Suspense>
                        </ErrorBoundary>
                    </AppShell>
                </LayerContextProvider>
            </RouterProvider>
        </ThemeContextProvider>
    </UserProvider>)
};

