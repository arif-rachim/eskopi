import {useEffect,useState} from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver, {useObserverListener} from "components/useObserver";
import useGradient from "components/useGradient";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import Button from "components/button/Button";
import {findMostMatchingComponent} from "../useRouter";
import routing from "../../routing";

function Page({Element,index,$activeIndex}) {
    const [$visible,setVisible] = useObserver($activeIndex.current === index);
    useObserverListener($activeIndex,(activeIndex) => {
        debugger;
        setVisible(activeIndex === index);
    });
    return <Vertical $visible={$visible}><Element.Element {...Element.params} path={Element.key}/></Vertical>;
}

export default function Books({pages, activePage, title, id,$activeIndex,index}) {
    const {controller,handleSubmit} = useForm({address: ''});
    const [$visible, setVisible] = useObserver(index === $activeIndex.current);
    const [pagesToRender,setPagesToRender] = useState(pages);
    useEffect(() => $activeIndex.addListener((activeIndex) => setVisible(activeIndex === index)), [$activeIndex, index, setVisible]);
    const PANEL_GRADIENT = useGradient(180).stop(0, 'light', -1).stop(0.1, 'light', -2).stop(0.9, 'light', -2).stop(1, 'light', -3).toString();
    const [$pageActiveIndex,setPageActiveIndex] = useObserver(0);
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
                const elementToMount = findMostMatchingComponent(data.address.split('/'),routing);

                setPagesToRender(pages => {
                    // lets check if the pages already contains same key, then we ignore this !
                    const matchPages = pages.filter(p => p.key === elementToMount.key);
                    if(matchPages > 0){
                        matchPages[0].params = elementToMount.params;
                        setPageActiveIndex(pages.indexOf(matchPages[0]));
                        return [...pages];
                    }

                    return [...pages,elementToMount];
                });
            })}>
                <Horizontal style={{flex: 1}} vAlign={'center'} gap={1}>
                    <Horizontal>Address</Horizontal>
                    <Controller name={'address'} render={Input} controller={controller} flex={1} autoCaps={false}/>
                    <Button>Go</Button>
                </Horizontal>
            </form>
        </Horizontal>
        {pagesToRender.map((Element,index) => <Page $activeIndex={$pageActiveIndex} index={index} Element={Element} key={Element.key} />)}
    </Vertical>
}