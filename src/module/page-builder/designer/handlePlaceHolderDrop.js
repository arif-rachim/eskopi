import {getPlaceHolder} from "module/page-builder/designer/getPlaceHolder";
import {v4 as uuid} from "uuid";


/**
 * Function to get parent element ids from current parentElement
 * @param element
 * @param root
 * @returns {string[]|*[]}
 */
function traceParentId(element, root) {
    const parentElement = element.parentElement;
    const dataId = parentElement.getAttribute('data-id');
    if (parentElement.parentElement !== root) {
        const newResult = traceParentId(parentElement, root);
        return [...newResult, dataId];
    } else {
        return [dataId];
    }
}

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

export function handlePlaceHolderDrop(rootRef, setData) {
    return (event) => {
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        const placeHolder = getPlaceHolder();
        const childIndex = Array.prototype.indexOf.call(placeHolder.parentElement.children, placeHolder);
        if (placeHolder.parentElement === rootRef.current) {
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
            const parentIds = traceParentId(placeHolder, rootRef.current);
            setData(oldData => {
                const newData = {...oldData};
                cleanDataFromTree(data, newData);
                let nodeToBeUpdated = newData;
                for (const id of parentIds) {
                    nodeToBeUpdated = nodeToBeUpdated.children.find(d => d.id === id);
                }
                nodeToBeUpdated.children = nodeToBeUpdated.children || [];
                nodeToBeUpdated.children.splice(childIndex, 0, {
                    id: uuid(),
                    ...data,
                    parentIds
                });
                return JSON.parse(JSON.stringify(newData));
            });
        }

    };
}