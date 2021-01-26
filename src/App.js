import {ThemeContextProvider} from "./components/useTheme";
import {LayerContextProvider} from "./components/useLayers";
import useRouter, {RouterProvider} from "./components/useRouter";

function App() {
    const Element = useRouter();
    if(Element){
        return <Element.Element {...Element.params}/>;
    }
    return <div></div>;
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

