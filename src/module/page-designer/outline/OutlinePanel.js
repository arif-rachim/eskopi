import Panel from "../../../components/panel/Panel";
import Tree from "components/tree/Tree";
import {Horizontal, Vertical} from "components/layout/Layout";
import {useObserverMapper} from "components/useObserver";
import {ControlsNaming} from "module/page-designer/controls/ControllerMapper";
import {useContext, useRef, useState} from "react";
import {DropListenerContext} from "module/page-designer/index";
import getOutlinePlaceHolder, {useOutlinePlaceHolderListener} from "module/page-designer/outline/getOutlinePlaceHolder";
import handleOutlinePlaceHolderDrop from "module/page-designer/outline/handleOutlinePlaceHolderDrop";
import {getPlaceHolder} from "module/page-designer/designer/getPlaceHolder";
import Button from "components/button/Button";
import {useConfirmMessage} from "components/dialog/Dialog";

function handlePlaceHolderDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
}


const handleRootDrop = (dropListener) => (event) => {
    getPlaceHolder({display: 'none'});
    getOutlinePlaceHolder({display: 'none'});
    event.preventDefault();
    event.stopPropagation();
    dropListener.current.call();
}

export default function OutlinePanel({$data, setData, $selectedController, setSelectedController}) {
    const rootRef = useRef();
    const treeRef = useRef();
    useOutlinePlaceHolderListener('drop', handleOutlinePlaceHolderDrop(treeRef, setData));
    useOutlinePlaceHolderListener('dragover', handlePlaceHolderDragOver);
    const dropListener = useContext(DropListenerContext);

    return <Panel headerTitle={'Outline'} onDrop={handleRootDrop(dropListener)} height={'100%'} brightness={-0.1}>
        <Tree $data={useObserverMapper($data, data => data.children)}
              $value={$selectedController}
              onChange={setSelectedController}
              itemRenderer={OutlineItemRenderer}
              rowProps={{
                  onDragOver: handleDragOver(),
              }}
              setData={setData}
              domRef={rootRef}
              compRef={treeRef}
        />
    </Panel>
}

const handleDragStart = (setIsDragging, data, dropListener) => (event) => {
    event.stopPropagation();
    setIsDragging(true);
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', JSON.stringify(data));
    dropListener.current = () => {
        setIsDragging(false);
        getOutlinePlaceHolder({display: 'none'});
        getPlaceHolder({display: 'none'});
    };
}
const handleDragEnd = (setIsDragging) => (event) => {
    setIsDragging(false);
}

function handleDragOver() {
    return (event) => {
        event.stopPropagation();
        event.preventDefault();
        const currentTarget = event.currentTarget;
        const parentTarget = currentTarget.parentNode;
        const elementPosition = currentTarget.getBoundingClientRect();
        const heightPad = 0.3 * elementPosition.height;
        const mouseIsUp = event.clientY < (elementPosition.top + heightPad);
        const mouseIsDown = event.clientY > (elementPosition.top + (elementPosition.height - heightPad));
        const placeHolder = getOutlinePlaceHolder({display: 'block'});
        if (mouseIsUp) {
            parentTarget.insertBefore(placeHolder, currentTarget);
        } else if (mouseIsDown) {
            const nextSibling = currentTarget.nextSibling;
            if (nextSibling) {
                parentTarget.insertBefore(placeHolder, nextSibling);
            } else {
                parentTarget.appendChild(placeHolder);
            }
        }
    }
}

function OutlineItemRenderer(props) {
    const [isDragging, setIsDragging] = useState();
    const dropListener = useContext(DropListenerContext);
    const selected = props.selected;
    const showConfirmation = useConfirmMessage();
    return <Horizontal opacity={isDragging ? 0.5 : 1} flex={'1 0 auto'}>
        <Vertical vAlign={'center'} pT={0.5} flex={1}
                  draggable={true}
                  onDragStart={handleDragStart(setIsDragging, props.data, dropListener)}
                  onDragEnd={handleDragEnd(setIsDragging)}>
            {ControlsNaming[props.data.type]}
        </Vertical>
        {selected &&
        <Button style={{fontSize: 10}} onClick={async () => {
            const status = await showConfirmation('Are you sure you want to delete this element ?');
            if (status === 'YES') {
                props.setData(oldData => {
                    const newData = JSON.parse(JSON.stringify(oldData));
                    let removedData = newData;
                    for (const parentId of props.data.parentIds) {
                        removedData = removedData.children.find(c => c.id === parentId);
                    }
                    removedData.children = removedData.children.filter(c => c.id !== props.data.id);
                    return newData;
                })
            }
        }}>❌</Button>
        }
    </Horizontal>

}