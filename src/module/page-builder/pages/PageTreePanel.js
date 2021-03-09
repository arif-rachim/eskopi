import useObserver, {useObserverListener, useObserverMapper} from "components/useObserver";
import useResource, {useResourceListener} from "components/useResource";
import useSlideDownStackPanel from "components/page/useSlideDownStackPanel";
import {useConfirmMessage} from "components/dialog/Dialog";
import {Horizontal, Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import Tree, {DefaultTreeDataKey, findTreeDataFromKey, removeTreeDataFromKey} from "components/tree/Tree";
import {v4 as uuid} from "uuid";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import Panel from "components/panel/Panel";

export default function PageTreePanel({$selectedPage, setSelectedPage}) {
    const $value = $selectedPage;
    const onChange = setSelectedPage;
    const [$pages, setPages] = useObserver({children: []});
    const [$pageResource, setPageResource] = useResource({url: '/db/pages'});

    useResourceListener($pageResource, (status, data) => {
        if (status === 'success') {
            if (Array.isArray(data)) {
                setPageResource('/db/pages/' + data[0])
            } else {
                setPages(data);
            }
        }
    });

    const [$showDelete, setShowDelete] = useObserver(false);
    useObserverListener($value, (item) => {
        setShowDelete(item !== null)
    });
    const showSlideDown = useSlideDownStackPanel();
    const showConfirmation = useConfirmMessage();
    return <Panel headerTitle={'Pages'} headerRenderer={HeaderRenderer}
                  $showDelete={$showDelete}
                  showConfirmation={showConfirmation}
                  $value={$value}
                  $pages={$pages}
                  setPageResource={setPageResource}
                  showSlideDown={showSlideDown}>
        <Tree $data={useObserverMapper($pages, page => page.children)} itemRenderer={PageTreeItemRenderer}
              $value={$value} onChange={onChange}/>
    </Panel>

}

function HeaderRenderer({$showDelete, showConfirmation, $value, $pages, setPageResource, showSlideDown}) {
    return <Horizontal hAlign={'right'} flex={1}>
        <Button $visible={$showDelete} p={0} onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const result = await showConfirmation(`Are you sure you want to delete ${$value.current.name}`);
            if (result === 'YES' && $value.current) {
                const pages = JSON.parse(JSON.stringify($pages.current));
                const selectedItem = $value.current;
                pages.children = removeTreeDataFromKey(pages.children, selectedItem.key_, DefaultTreeDataKey);
                setPageResource('/db/pages', pages);
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
            const name = await showSlideDown(({closePanel}) => <PageDetail closePanel={closePanel}/>);
            if (name === false) {
                return;
            }
            const oldPages = JSON.parse(JSON.stringify($pages.current));
            if ($value.current) {
                const selectedItem = findTreeDataFromKey(oldPages.children, $value.current.key_, DefaultTreeDataKey);
                if (!selectedItem) {
                    return;
                }
                selectedItem.children = selectedItem.children || [];
                selectedItem.children.push({id: uuid(), name, children: []});
            } else {
                oldPages.children.push({id: uuid(), name, children: []});
            }
            setPageResource('/db/pages', oldPages);
        }}>
            <svg viewBox='0 0 512 512' width={16} height={16}>
                <path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round'
                      strokeWidth='32' d='M256 112v288M400 256H112'/>
            </svg>
        </Button>
    </Horizontal>

}


function PageTreeItemRenderer(props) {
    return <Vertical>
        {props.data.name}
    </Vertical>
}


function PageDetail({closePanel}) {
    const {controller, handleSubmit} = useForm({name: ''});
    const confirmation = useConfirmMessage();
    return <Vertical vAlign={'center'} hAlign={'center'} p={3} gap={2}>
        <Vertical fSize={16} p={3}>Add New Page</Vertical>
        <form action="" onSubmit={handleSubmit((value) => {
            closePanel(value.name);
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
