import {memo, useEffect, useRef} from "react";
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
    useObserverListener($activeIndex, (activeIndex) => {
        setVisible(activeIndex === index);
    });
    const pageRef = useRef();


    return <Vertical domRef={pageRef} $visible={$visible} height={'100%'}>
        <PageDimensionProvider pageRef={pageRef}>
            <SlideDownStackPanelContextProvider>
                <PageLayerContextProvider>
                    <Element.Element {...Element.params} path={Element.key}/>
                </PageLayerContextProvider>
            </SlideDownStackPanelContextProvider>
        </PageDimensionProvider>
    </Vertical>
}

const MemoPage = memo(Page);

export default function Pages({pages, activePage, title, id, $activeIndex, index}) {
    const {controller, handleSubmit} = useForm({address: ''});
    const [$visible, setVisible] = useObserver(index === $activeIndex.current);
    useEffect(() => setVisible(index === $activeIndex.current), [index, $activeIndex, setVisible]);
    const [$pagesToRender, setPagesToRender] = useObserver(pages);
    useEffect(() => $activeIndex.addListener((activeIndex) => setVisible(activeIndex === index)), [$activeIndex, index, setVisible]);
    const PANEL_GRADIENT = useGradient(180).stop(0, 'light', -1).stop(0.1, 'light', -2).stop(0.9, 'light', -2).stop(1, 'light', -3).toString();
    const [$pageActiveIndex, setPageActiveIndex] = useObserver(0);
    return <Vertical height={'100%'} width={'100%'} position={'absolute'} $visible={$visible}>
        <Horizontal background={PANEL_GRADIENT} p={1} vAlign={'center'} gap={2}>
            <Horizontal>
                <Button p={0} style={{height: 30}} color={'light'} brightness={-2}>
                    <svg viewBox='0 0 512 512' width={20} height={20}>
                        <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round'
                              strokeWidth='20' d='M244 400L100 256l144-144M120 256h292'/>
                    </svg>
                </Button>
                <Button p={0} style={{height: 30}} color={'light'} brightness={-2}>
                    <svg viewBox='0 0 512 512' width={20} height={20}>
                        <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round'
                              strokeWidth='20' d='M268 112l144 144-144 144M392 256H100'/>
                    </svg>
                </Button>
            </Horizontal>
            <form action="" style={{display: 'flex', flex: 1}} onSubmit={handleSubmit((data) => {
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
                <Horizontal style={{flex: 1}} vAlign={'center'} gap={1}>
                    <Horizontal>Address</Horizontal>
                    <Controller name={'address'} render={Input} controller={controller} flex={1} autoCaps={false}/>
                    <Button>Go</Button>
                </Horizontal>
            </form>
        </Horizontal>
        <Vertical height={'100%'}>
            <ObserverValue render={RenderPages} $observer={$pagesToRender} $pageActiveIndex={$pageActiveIndex}/>
        </Vertical>
    </Vertical>
}

function RenderPages({value, $pageActiveIndex}) {
    return value.map((Element, index) => {
        const key = Element.key || '/';
        return <MemoPage $activeIndex={$pageActiveIndex} index={index} Element={Element} key={key}/>
    })
}