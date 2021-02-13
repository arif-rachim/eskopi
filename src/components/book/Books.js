import {useEffect} from "react";
import {Vertical} from "components/layout/Layout";
import useObserver from "components/useObserver";

export default function Books({pages, activePage, title, id, index, $activeIndex}) {
    const [$visible, setVisible] = useObserver(index === $activeIndex.current);
    useEffect(() => $activeIndex.addListener((activeIndex) => setVisible(activeIndex === index)), [$activeIndex, index, setVisible]);
    return <Vertical height={'100%'} width={'100%'} position={'absolute'} $visible={$visible}>
        {pages.map(Element => <Element.Element {...Element.params} key={Element.key}/>)}
    </Vertical>
}