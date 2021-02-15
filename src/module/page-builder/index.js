import {Horizontal, Vertical} from "../../components/layout/Layout";
import Button from "components/button/Button";
import useObserver, {ObserverValue} from "components/useObserver";
import React, {useState} from "react";
import useSlideDownStackPanel from "components/page/useSlideDownStackPanel";

function DataTree({data = [], level = 0, $selectedItem, setSelectedItem}) {
    const [$_selectedItem, _setSelectedItem] = useObserver();
    $selectedItem = $selectedItem || $_selectedItem;
    setSelectedItem = setSelectedItem || _setSelectedItem;
    return <Vertical height={'100%'} color={"light"} brightness={-0.5} b={2}>
        {data.map(branch => {
            const hasChildren = branch.children && branch.children.length > 0;
            return <Vertical key={branch.id}>
                <ObserverValue $observer={$selectedItem} render={({value, branch}) => {
                    const selectedValue = value?.id === branch.id;
                    return <Horizontal pL={level * 5} color={"light"} brightness={selectedValue ? -3 : -1}
                                       brightnessHover={-2} brightnessMouseDown={-3}
                                       onClick={() => setSelectedItem(branch)}>{branch.name}</Horizontal>
                }} branch={branch}/>
                {hasChildren && <DataTree data={branch.children} level={level + 1} $selectedItem={$selectedItem}
                                          setSelectedItem={setSelectedItem}/>}
            </Vertical>
        })}
    </Vertical>;
}

function PagesTree() {
    const [$selectedItem, setSelectedItem] = useObserver();
    const [pages] = useState([]);
    const showSlideDown = useSlideDownStackPanel();
    return <Vertical height={'100%'}>
        <Horizontal color={"light"} brightness={-1} p={1} vAlign={'center'}>
            Pages
            <Horizontal flex={1}/>
            <Button onClick={async () => {
                await showSlideDown(({closePanel}) => <MyPage closePanel={closePanel}/>);

            }}>Add</Button>
        </Horizontal>
        {<DataTree data={pages} setSelectedItem={setSelectedItem} $selectedItem={$selectedItem} level={0}/>}
    </Vertical>;
}

export default function PageBuilder() {
    return <Vertical color={'primary'} height={'100%'}>
        <Horizontal height={'100%'}>
            <Vertical height={'100%'} width={200} color={"light"}>
                <PagesTree/>
            </Vertical>
            <Vertical flex={1}></Vertical>
            <Vertical width={200} color={"light"}></Vertical>
        </Horizontal>
    </Vertical>
}

PageBuilder.title = 'Page Builder';

//export default React.memo(PageBuilder);

function MyPage({closePanel}) {

    const showSlideDown = useSlideDownStackPanel();
    return <Vertical height={300} width={300} color={"secondary"} vAlign={'center'} hAlign={'center'}>
        <Horizontal gap={5}>
            <Button onClick={() => closePanel('SEDAP GAN')}>Close Me</Button>
            <Button onClick={async () => {
                await showSlideDown(({closePanel}) => <MyPage closePanel={closePanel}/>);
            }}>Add more slider</Button>
        </Horizontal>
    </Vertical>
}