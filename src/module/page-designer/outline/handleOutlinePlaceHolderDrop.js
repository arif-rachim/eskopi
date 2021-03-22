import {Controls} from "module/page-designer/controls/ControllerMapper";
import getOutlinePlaceHolder from "module/page-designer/outline/getOutlinePlaceHolder";
import {v4 as uuid} from "uuid";
import {getPlaceHolder} from "module/page-designer/designer/getPlaceHolder";

function cleanDataFromTree(data, dataToRemove) {
    if (data.id) {
        if (data.parentIds) {
            for (const idsToTrace of data.parentIds) {
                dataToRemove = dataToRemove?.children?.find(child => child.id === idsToTrace);
            }
        }
        if (dataToRemove) {
            dataToRemove.children = dataToRemove.children?.filter(child => child.id !== data.id);
        }
    }
}

export default function handleOutlinePlaceHolderDrop(treeRef, setData) {
    return (event) => {
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        const currentTarget = event.currentTarget;
        const childIndex = Array.prototype.indexOf.call(currentTarget.parentNode.children, currentTarget);
        const treeListData = treeRef.current.$listData.current;
        if (childIndex === 0) {
            setData(oldData => {
                const newData = {...oldData};
                newData.children = newData.children || [];
                cleanDataFromTree(data, newData);
                newData.children.splice(childIndex, 0, {
                    id: uuid(),
                    ...data,
                    parentIds: []
                });
                newData.children = [...newData.children];
                return newData;
            });
        } else {
            const parentNode = treeListData[childIndex - 1];
            if (parentNode && parentNode.type === Controls.SPACE) {
                setData(oldData => {
                    const newData = {...oldData};
                    cleanDataFromTree(data, newData);
                    let nodeToBeUpdated = newData;
                    for (const id of parentNode.parentIds) {
                        nodeToBeUpdated = nodeToBeUpdated.children.find(d => d.id === id);
                    }
                    nodeToBeUpdated = nodeToBeUpdated.children.find(d => d.id === parentNode.id);
                    nodeToBeUpdated.children = nodeToBeUpdated.children || [];
                    nodeToBeUpdated.children.splice(0, 0, {
                        id: uuid(),
                        ...data,
                        parentIds: [...parentNode.parentIds, parentNode.id]
                    });
                    return JSON.parse(JSON.stringify(newData));
                });
            } else {
                let childPositionFromTree = 0;
                let parentNode = null;
                for (let i = childIndex; i > 0; i--) {
                    if (treeListData[i] && treeListData[i].type === Controls.SPACE) {
                        parentNode = treeListData[i];
                        break;
                    }
                    childPositionFromTree++;
                }
                setData(oldData => {
                    const newData = {...oldData};
                    cleanDataFromTree(data, newData);
                    let nodeToBeUpdated = newData;
                    if (parentNode) {
                        for (const id of parentNode.parentIds) {
                            nodeToBeUpdated = nodeToBeUpdated.children.find(d => d.id === id);
                        }
                    }

                    nodeToBeUpdated = nodeToBeUpdated.children.find(d => d.id === parentNode?.id);
                    if (nodeToBeUpdated === undefined) {
                        return oldData;
                    }
                    nodeToBeUpdated.children = nodeToBeUpdated.children || [];
                    nodeToBeUpdated.children.splice(childPositionFromTree - 1, 0, {
                        id: uuid(),
                        ...data,
                        parentIds: [...parentNode.parentIds, parentNode.id]
                    });
                    return JSON.parse(JSON.stringify(newData));
                });
            }
        }
        getOutlinePlaceHolder({display: 'none'});
        getPlaceHolder({display: 'none'});
    };
}
