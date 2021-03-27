import {ThemeContextProvider} from "components/useTheme";
import {LayerContextProvider} from "components/useLayers";
import useRouter, {RouterProvider} from "./components/useRouter";
import {createContext, Suspense, useCallback, useState} from "react";
import LoginScreen from "module/login";
import {AuthCheck, UserProvider} from "components/authentication/useUser";
import ErrorBoundary from "components/error-boundary/ErrorBoundary"
import AppShell from "components/app-shell/AppShell";
import {Horizontal, Vertical} from "components/layout/Layout";
import {v4 as uuid} from "uuid";
import Pages from "components/page/Pages";
import useObserver, {
    ObserverValue,
    useObserverListener,
    useObserverMapper,
    useObserverValue
} from "components/useObserver";

function handleOnChange(setActiveTab) {
    return (index) => setActiveTab(index);
}

function handleOnClose(setBooks, setActiveTab) {
    return (index) => {
        setBooks(oldBooks => {
            const newBooks = [...oldBooks];
            newBooks.splice(index, 1);
            setActiveTab((currentActiveTab) => {
                if (index === newBooks.length && index > 0) {
                    return index - 1;
                } else if (oldBooks.length - 1 === currentActiveTab) {
                    return currentActiveTab - 1;
                }
                return currentActiveTab;
            })
            return newBooks;
        });
    };
}

const TitlesContext = createContext([]);

function App() {
    const $element = useRouter();
    const [$books, setBooks] = useObserver([{
        pages: [$element.current],
        id: uuid()
    }]);
    useObserverListener($element, (NewElement) => {
        setBooks(pages => {
            return [...pages, {pages: [NewElement], id: uuid()}];
        })
    })
    const [$activeTab, setActiveTab] = useObserver(0);
    const [$bookTitles, setBookTitles] = useObserver({});
    useObserverListener($books, books => {
        setBookTitles(oldTitles => {
            const booksIds = books.map(book => book.id);
            const nextTitles = {};
            Object.keys(oldTitles).forEach(key => {
                if (booksIds.indexOf(key) >= 0) {
                    nextTitles[key] = oldTitles[key];
                }
            });
            books.forEach(book => {
                const bookId = book.id;
                if (nextTitles[bookId] === undefined) {
                    nextTitles[bookId] = '';
                }
            });
            return nextTitles;
        })
    });


    return <AuthCheck fallback={<LoginScreen/>}>
        <Vertical height={'100%'}>
            <TitlesContext.Provider value={setBookTitles}>
                <TabMenu $data={useObserverMapper($bookTitles, titles => Object.keys(titles).map(key => titles[key]))}
                         $value={$activeTab}
                    // eslint-disable-next-line
                         onChange={useCallback(handleOnChange(setActiveTab), [])}
                    // eslint-disable-next-line
                         onClose={useCallback(handleOnClose(setBooks, setActiveTab), [])}/>
                <Vertical height={'calc(100% - 23px)'}>
                    <ObserverValue $observers={$books}>
                        {(books) => books.map((book, index) => {
                            return <Pages key={book.id} index={index} $activeIndex={$activeTab}
                                          setBookTitles={setBookTitles} {...book}/>
                        })}
                    </ObserverValue>
                </Vertical>
            </TitlesContext.Provider>
        </Vertical>
    </AuthCheck>
}

function TabButton({index, $selectedIndex, onChange, onClose, title}) {
    const [brightness, setBrightness] = useState(index === $selectedIndex.current ? -1 : -12);
    useObserverListener($selectedIndex, selectedIndex => {
        setBrightness(selectedIndex === index ? -1 : -12);
    });
    return <Horizontal color={"light"}
                       gap={2}
                       vAlign={'center'}
                       brightnessHover={-2}
                       brightness={brightness}
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

function TabMenu({$data, $value, onChange, onClose}) {
    const data = useObserverValue($data);
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

