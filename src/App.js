import {ThemeContextProvider} from "./components/useTheme";
import {LayerContextProvider} from "./components/useLayers";
import useRouter, {RouterProvider} from "./components/useRouter";

function App() {
    const Element = useRouter();
    return <Element.Element {...Element.params}/>;
}

export default function Provider() {
    return (<ThemeContextProvider>
        <RouterProvider>
            <LayerContextProvider>
                <App/>
            </LayerContextProvider>
        </RouterProvider>
    </ThemeContextProvider>)
};

