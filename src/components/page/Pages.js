import {createContext, memo, useCallback, useContext, useEffect, useRef} from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver, {ObserverValue, useObserverListener} from "components/useObserver";
import useGradient from "components/useGradient";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import Button from "components/button/Button";
import {findMostMatchingComponent} from "../useRouter";
import routing from "../../routing";
import {PageDimensionProvider} from "components/page/usePageDimension";
import {PageLayerContextProvider} from "components/page/usePageLayers";
import {SlideDownStackPanelContextProvider} from "components/page/useSlideDownStackPanel";

function Page({Element, index, $activeIndex}) {
    const [$visible, setVisible] = useObserver($activeIndex.current === index);
    useObserverListener($activeIndex, (activeIndex) => setVisible(activeIndex === index));
    const pageRef = useRef();
    const setTitle = useContext(SetTitleContext);
    return <Vertical domRef={pageRef} $visible={$visible} height={'100%'}>
        <PageDimensionProvider pageRef={pageRef}>
            <SlideDownStackPanelContextProvider>
                <PageLayerContextProvider>
                    <Element.Element params={Element.params} path={Element.key} setTitle={setTitle}/>
                </PageLayerContextProvider>
            </SlideDownStackPanelContextProvider>
        </PageDimensionProvider>
    </Vertical>
}

const MemoPage = memo(Page);
export const SetTitleContext = createContext((title) => {
});
export default function Pages({pages, id, $activeIndex, index, setBookTitles}) {
    const {control, handleSubmit} = useForm({address: ''});
    const [$visible, setVisible] = useObserver(index === $activeIndex.current);
    useEffect(() => setVisible(index === $activeIndex.current), [index, $activeIndex, setVisible]);
    const [$pagesToRender, setPagesToRender] = useObserver(pages);
    useObserverListener($activeIndex, (activeIndex) => setVisible(activeIndex === index));
    const PANEL_GRADIENT = useGradient(180).stop(0, 'light', -1).stop(0.1, 'light', -2).stop(0.9, 'light', -2).stop(1, 'light', -3).toString();
    const [$pageActiveIndex, setPageActiveIndex] = useObserver(0);
    const [$showAddressBar,] = useObserver(true);
    const setTitle = useCallback((title) => {
        setBookTitles(titles => {
            const newTitles = {...titles};
            newTitles[id] = title;
            return newTitles;
        });

    }, [id, setBookTitles]);
    return <SetTitleContext.Provider value={setTitle}>
        <Vertical height={'100%'} width={'100%'} position={'absolute'} $visible={$visible}>
            <Horizontal background={PANEL_GRADIENT} vAlign={'center'} gap={2} $visible={$showAddressBar}>
                <Horizontal>
                    <Button p={0} color={'light'} brightness={-2}>
                        <svg viewBox='0 0 512 512' width={16} height={16}>
                            <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round'
                                  strokeWidth='22' d='M244 400L100 256l144-144M120 256h292'/>
                        </svg>
                    </Button>
                    <Button p={0} color={'light'} brightness={-2}>
                        <svg viewBox='0 0 512 512' width={16} height={16}>
                            <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round'
                                  strokeWidth='22' d='M268 112l144 144-144 144M392 256H100'/>
                        </svg>
                    </Button>
                </Horizontal>
                <form action="" style={{display: 'flex', flex: '1 0 auto'}} onSubmit={handleSubmit((data) => {
                    const elementToMount = findMostMatchingComponent(data.address.split('/'), routing);
                    setPagesToRender(pages => {
                        const matchPages = pages.filter(p => p.key === elementToMount.key);
                        if (matchPages.length > 0) {
                            matchPages[0].params = elementToMount.params;
                            const activePageIndex = pages.indexOf(matchPages[0]);
                            setPageActiveIndex(activePageIndex);
                            return [...pages];
                        }
                        setPageActiveIndex(pages.length);
                        return [...pages, elementToMount];
                    });
                })}>
                    <Horizontal style={{flex: '1 0 auto'}} vAlign={'center'} gap={1} p={1}>
                        <Horizontal>Address</Horizontal>
                        <Controller name={'address'} render={Input} control={control}
                                    containerStyle={{flex: '1 0 auto'}}
                                    autoCaps={false}/>
                        <Button>Go</Button>
                    </Horizontal>
                </form>
            </Horizontal>
            <Vertical height={'calc(100% - 30px)'}>
                <ObserverValue $observers={$pagesToRender}>
                    {(value) => {
                        return <RenderPages value={value} $pageActiveIndex={$pageActiveIndex}/>
                    }}
                </ObserverValue>
            </Vertical>
        </Vertical>
    </SetTitleContext.Provider>
}

function RenderPages({value, $pageActiveIndex}) {
    return value.map((Element, index) => {
        const key = Element.key || '/';
        return <MemoPage $activeIndex={$pageActiveIndex} index={index} Element={Element} key={key}/>
    })
}