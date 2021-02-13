import {ThemeContextProvider} from "./components/useTheme";
import {LayerContextProvider} from "./components/useLayers";
import useRouter, {RouterProvider} from "./components/useRouter";
import {Suspense, useEffect, useState} from "react";
import LoginScreen from "module/login";
import RegistrationScreen from "module/registration";
import {AuthCheck, UserProvider} from "components/authentication/useUser";
import ErrorBoundary from "components/error-boundary/ErrorBoundary"
import AppShell from "components/app-shell/AppShell";
import {Horizontal, Vertical} from "./components/layout/Layout";
import useObserver, {useObserverValue} from "./components/useObserver";

function App() {
    const $element = useRouter();
    const [$selectedElementIndex,setSelectedElementIndex] = useObserver(0);
    const [elementStacks, setElementStacks] = useState([{
        Element: $element.current.Element,
        params: $element.current.params,
        key: $element.current.key
    }]);
    useEffect(() => {
        return $element.addListener((element) => {
            setElementStacks(oldStacks => {
                return [...oldStacks, {Element: element.Element, params: element.params, key: element.key}];
            })
        });
    }, []);
    const Element = $element.current.Element;
    if (Element === RegistrationScreen) {
        return <Element {...$element.current.params}/>;
    }
    return <AuthCheck fallback={<LoginScreen/>}>
        <Vertical height={'100%'}>
            <TabMenu data={elementStacks.map(element => element.Element.title)} $value={$selectedElementIndex} onChange={(index) => setSelectedElementIndex(index)}/>
            <Vertical height={'100%'}>
                {elementStacks.map((Element, index) => {
                    return <Element.Element key={index} {...Element.params}/>
                })}
            </Vertical>
        </Vertical>
    </AuthCheck>
}

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function TabMenu({data=[],$value,onChange}){
    return <Horizontal bB={1} color={"light"} brightness={-0.5}>
        {data.map((data,index) => {
            return <TabButton index={index} title={data} $selectedIndex={$value} onClick={() => onChange(index)}/>
        })}
    </Horizontal>
}

function TabButton({index,title,$selectedIndex,onClick}){
    const selectedIndex = useObserverValue($selectedIndex);
    return <Horizontal color={'light'}
                       key={index}
                       brightness={selectedIndex === index ? -3:0}
                       brightnessHover={-1}
                       brightnessMouseDown={-2}
                       cursor={"pointer"}
                       onClick={onClick}
                       bR={1} key={title} p={1} pL={3} pR={3} style={{minWidth:100}} hAlign={'center'}>
        {title}
    </Horizontal>
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

