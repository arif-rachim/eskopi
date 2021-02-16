import {Horizontal, Vertical} from "../../components/layout/Layout";
import Button from "components/button/Button";
import useObserver, {ObserverValue, useObserverListener} from "components/useObserver";
import React, {useEffect, useRef} from "react";
import useSlideDownStackPanel from "components/page/useSlideDownStackPanel";
import useForm, {Controller} from "components/useForm";
import {useConfirmMessage} from "components/dialog/Dialog";
import {v4 as uuid} from "uuid";
import Input from "components/input/Input";


function DataTree({data = [], level = 0, $selectedItem, setSelectedItem}) {
    const [$_selectedItem, _setSelectedItem] = useObserver();
    $selectedItem = $selectedItem || $_selectedItem;
    setSelectedItem = setSelectedItem || _setSelectedItem;
    const containerRef = useRef();
    return <Vertical domRef={containerRef} color={"light"} brightness={-0.5} b={2}>
        {data.map(branch => {
            const hasChildren = branch.children && branch.children.length > 0;
            return <Vertical key={branch.id}>
                <ObserverValue $observer={$selectedItem} render={ValueRenderer} branch={branch}
                               setSelectedItem={setSelectedItem} level={level}/>
                {hasChildren && <DataTree data={branch.children} level={level + 1} $selectedItem={$selectedItem}
                                          setSelectedItem={setSelectedItem}/>}
            </Vertical>
        })}
    </Vertical>;
}

function ValueRenderer({value, branch, setSelectedItem, level}) {
    const selectedValue = value?.id === branch.id;
    const hasChildren = branch.children && branch.children.length > 0;
    const [$hasChildren, setHasChildren] = useObserver(false);
    useEffect(() => setHasChildren(hasChildren), [hasChildren, setHasChildren]);
    return <Horizontal pL={(level) * 6} color={"light"} brightness={selectedValue ? -3 : -1}
                       brightnessHover={-2} brightnessMouseDown={-3}
                       onClick={() => setSelectedItem(branch)}>
        <Button p={0} pT={0} pB={0} $visible={$hasChildren}>
            <svg viewBox='0 0 512 512' width={16} height={16}>
                <path fill='none' stroke='currentColor' strokeLinecap='round'
                      strokeLinejoin='round' strokeWidth='16' d='M112 184l144 144 144-144'/>
            </svg>
        </Button>
        {branch.name}
    </Horizontal>

}

function PagesTree() {
    const [$selectedItem, setSelectedItem] = useObserver();
    const [$pages, setPages] = useObserver([]);
    const [$showDelete, setShowDelete] = useObserver(false);
    useObserverListener($selectedItem, (item) => {
        setShowDelete(item !== null)
    });
    const showSlideDown = useSlideDownStackPanel();
    const showConfirmation = useConfirmMessage();
    return <Vertical height={'100%'}>
        <Horizontal color={"light"} brightness={-1} p={1} vAlign={'center'} onClick={() => {
            setSelectedItem(null);
        }}>
            Pages
            <Horizontal flex={1}/>
            <Button $visible={$showDelete} p={0} onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const result = await showConfirmation('Are you sure you want to delete this Page');
                if (result === 'YES' && $selectedItem.current) {
                    if ($selectedItem.current.parent) {
                        $selectedItem.current.parent.children.splice($selectedItem.current.parent.children.indexOf($selectedItem.current), 1);
                        setPages(oldPages => [...oldPages]);
                    } else {
                        setPages(oldPages => oldPages.filter(page => page !== $selectedItem.current));
                    }
                    setSelectedItem(null);
                }
            }}>
                <svg viewBox='0 0 512 512' width={16} height={16}>
                    <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round'
                          strokeWidth='32' d='M400 256H112'/>
                </svg>
            </Button>
            <Button p={0} onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const result = await showSlideDown(({closePanel}) => <PageDetail closePanel={closePanel}/>);
                if (result) {
                    if ($selectedItem.current) {
                        result.parent = $selectedItem.current;
                        $selectedItem.current.children.push(result);
                        setPages(oldPages => [...oldPages]);
                    } else {
                        setPages(oldPages => {
                            return [...oldPages, result]
                        });
                    }
                }
            }}>
                <svg viewBox='0 0 512 512' width={16} height={16}>
                    <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round'
                          strokeWidth='32' d='M256 112v288M400 256H112'/>
                </svg>
            </Button>
        </Horizontal>
        <Vertical height={'100%'} color={"light"} brightness={-2} overflow={'auto'}>
            <ObserverValue $observer={$pages} render={({value}) => {
                return <DataTree data={value} setSelectedItem={setSelectedItem} $selectedItem={$selectedItem}
                                 level={0}/>
            }}/>
        </Vertical>
    </Vertical>;
}

export default function PageBuilder() {
    return <Vertical height={'100%'}>
        <Horizontal height={'100%'}>
            <Vertical height={'100%'} width={200} color={"light"}>
                <PagesTree/>
            </Vertical>
            <Vertical flex={1}></Vertical>
            <Vertical width={200} color={"light"} brightness={-3}></Vertical>
        </Horizontal>
    </Vertical>
}

PageBuilder.title = 'Page Builder';

function PageDetail({closePanel}) {
    const {controller, handleSubmit} = useForm({name: ''});
    const confirmation = useConfirmMessage();
    return <Vertical vAlign={'center'} hAlign={'center'} p={3} gap={2}>
        <Vertical fSize={16} p={3}>Add New Page</Vertical>
        <form action="" onSubmit={handleSubmit((value) => {
            closePanel({id: uuid(), name: value.name, children: []})
        })}>
            <Vertical gap={10}>
                <Controller render={Input} label={'Page Name'} name={'name'} controller={controller}
                            validator={requiredValidator('Name is mandatory')} autoFocus={true}/>
                <Horizontal gap={5}>
                    <Button color={"primary"} type={'submit'} flex={1}>Save</Button>
                    <Button type={'button'} onClick={async () => {
                        const modified = Object.keys(controller.current.modified).length > 0;
                        if (modified) {
                            const result = await confirmation('Are you sure you want to cancel changes ?')
                            if (result === 'YES') {
                                closePanel(false);
                            }
                        } else {
                            closePanel(false);
                        }
                    }}>Cancel</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}

function requiredValidator(message) {
    return (value) => {
        if (value === null || value === undefined || value === '') {
            return message;
        }
        return '';
    }
}