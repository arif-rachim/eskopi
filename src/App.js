import {ThemeContextProvider} from "./components/useTheme";
import {LayerContextProvider} from "./components/useLayers";
import useRouter, {RouterProvider} from "./components/useRouter";
import {Suspense, useEffect, useState} from "react";
import LoginScreen from "module/login";
import {AuthCheck, UserProvider} from "components/authentication/useUser";
import ErrorBoundary from "components/error-boundary/ErrorBoundary"
import AppShell from "components/app-shell/AppShell";
import {Horizontal, Vertical} from "./components/layout/Layout";
import {v4 as uuid} from "uuid";
import Books from "components/book/Books";
import useObserver, {useObserverValue} from "components/useObserver";

function App() {
    const $element = useRouter();

    const [books, setBooks] = useState([{
        pages: [$element.current],
        activePage: 0,
        title: $element.current.Element.title,
        id: uuid()
    }]);
    useEffect(() => $element.addListener((NewElement) => {
        setBooks(pages => {
            return [...pages, {pages: [NewElement], activePage: 0, title: NewElement.Element.title, id: uuid()}];
        })
    }), [$element]);

    const [$activeTab, setActiveTab] = useObserver(0);

    return <AuthCheck fallback={<LoginScreen/>}>
        <Vertical height={'100%'}>
            <TabMenu data={books.map(book => book.title)} $value={$activeTab}
                     onChange={(index) => setActiveTab(index)} onClose={(index) => {
                setBooks(oldBooks => {
                    const newBooks = [...oldBooks];
                    newBooks.splice(index, 1);
                    return newBooks;
                })
            }}/>
            <Vertical height={'100%'}>
                {books.map((book, index) => {
                    return <Books key={book.id} index={index} $activeIndex={$activeTab} {...book}/>
                })}
            </Vertical>
        </Vertical>
    </AuthCheck>
}

function TabButton({index, $selectedIndex, onChange, onClose, title}) {
    const selectedIndex = useObserverValue($selectedIndex);
    return <Horizontal color={"light"}
                       gap={2}
                       vAlign={'center'}
                       brightnessHover={-2}
                       brightness={selectedIndex === index ? -12 : -1}
                       brightnessMouseDown={-3}
                       p={2}
                       pT={1}
                       pB={1}
                       cursor={"pointer"}
                       bR={1} onClick={() => onChange(index)}><Vertical>{title}</Vertical> <CloseIcon
        onClose={() => onClose(index)}/></Horizontal>;
}

function CloseIcon({onClose}) {
    return <Vertical onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    }}>
        <svg viewBox='0 0 512 512' width={17} height={17}>
            <path d='M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z' fill='none'
                  stroke='currentColor' strokeMiterlimit='10' strokeWidth='17'/>
            <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='17'
                  d='M320 320L192 192M192 320l128-128'/>
        </svg>
    </Vertical>
}

function TabMenu({data = [], $value, onChange, onClose}) {

    return <Horizontal color={"light"} bB={1}>
        {data.map((title, index) => {
            return <TabButton key={index} index={index} $selectedIndex={$value} onChange={onChange} title={title}
                              onClose={onClose}/>
        })}
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

