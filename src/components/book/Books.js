import {useEffect} from "react";
import {Horizontal, Vertical} from "components/layout/Layout";
import useObserver from "components/useObserver";
import useGradient from "components/useGradient";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import Button from "components/button/Button";

export default function Books({pages, activePage, title, id, index, $activeIndex}) {
    const {controller} = useForm({address: ''});
    const [$visible, setVisible] = useObserver(index === $activeIndex.current);
    useEffect(() => $activeIndex.addListener((activeIndex) => setVisible(activeIndex === index)), [$activeIndex, index, setVisible]);
    const PANEL_GRADIENT = useGradient(180).stop(0, 'light', -1).stop(0.1, 'light', -2).stop(0.9, 'light', -2).stop(1, 'light', -3).toString();
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
            <Horizontal>Address</Horizontal>
            <Controller name={'address'} render={Input} controller={controller} flex={1}/>
            <Button>Go</Button>
        </Horizontal>
        {pages.map(Element => <Element.Element {...Element.params} key={Element.key}/>)}
    </Vertical>
}