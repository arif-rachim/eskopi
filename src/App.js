import {ThemeContextProvider} from "./components/useTheme";
import {LayerContextProvider} from "./components/useLayers";
import useRouter, {RouterProvider} from "./components/useRouter";
import {Suspense, useEffect, useState} from "react";
import LoginScreen from "module/login";
import {AuthCheck, UserProvider} from "components/authentication/useUser";
import ErrorBoundary from "components/error-boundary/ErrorBoundary"
import AppShell from "components/app-shell/AppShell";
import {Vertical} from "./components/layout/Layout";

function App() {
    const $element = useRouter();

    const [Element, setElement] = useState($element.current);
    useEffect(() => $element.addListener((NewElement) => {
        setElement(NewElement);
    }), [$element]);
    return <AuthCheck fallback={<LoginScreen/>}>
        <Vertical height={'100%'}>
            <Element.Element {...Element.params} />
        </Vertical>
    </AuthCheck>
}

export default function Provider() {
    return (<UserProvider>
        <ThemeContextProvider>
            <RouterProvider>
                <LayerContextProvider>
                    <ErrorBoundary>
                        <AppShell>
                            <ErrorBoundary>
                                <Suspense fallback={<div>Loading ...</div>}>
                                    <App/>
                                </Suspense>
                            </ErrorBoundary>
                        </AppShell>
                    </ErrorBoundary>
                </LayerContextProvider>
            </RouterProvider>
        </ThemeContextProvider>
    </UserProvider>)
};

