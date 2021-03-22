import {getPlaceHolder} from "module/page-designer/designer/getPlaceHolder";

export const handleDragOverControlComponent = () => {
    return (event) => {
        event.stopPropagation();
        event.preventDefault();
        const currentTarget = event.currentTarget;
        const parentTarget = currentTarget.parentNode;
        const elementPosition = currentTarget.getBoundingClientRect();
        const isLayout = currentTarget.getAttribute('data-layout');
        const heightPad = isLayout ? 5 : 0.3 * elementPosition.height;
        const widthPad = isLayout ? 5 : 0.3 * elementPosition.width;
        const mouseIsUp = event.clientY < (elementPosition.top + heightPad);
        const mouseIsDown = event.clientY > (elementPosition.top + (elementPosition.height - heightPad));
        const mouseIsLeft = event.clientX < (elementPosition.left + widthPad);
        const mouseIsRight = event.clientX > (elementPosition.left + (elementPosition.width - widthPad));

        const parentLayout = parentTarget.getAttribute('data-layout');
        const placeHolder = getPlaceHolder({display: 'block'});
        if (parentLayout === 'horizontal') {
            if (mouseIsLeft) {
                parentTarget.insertBefore(placeHolder, currentTarget);
            } else if (mouseIsRight) {
                const nextSibling = currentTarget.nextSibling;
                if (nextSibling) {
                    parentTarget.insertBefore(placeHolder, nextSibling);
                } else {
                    parentTarget.appendChild(placeHolder);
                }
            } else if (isLayout === 'horizontal') {
                currentTarget.appendChild(placeHolder);

            } else if (isLayout === 'vertical') {
                currentTarget.appendChild(placeHolder);
            }
        }
        if (parentLayout === 'vertical') {
            if (mouseIsUp) {
                parentTarget.insertBefore(placeHolder, currentTarget);
            } else if (mouseIsDown) {
                const nextSibling = currentTarget.nextSibling;
                if (nextSibling) {
                    parentTarget.insertBefore(placeHolder, nextSibling);
                } else {
                    parentTarget.appendChild(placeHolder);
                }
            } else if (isLayout === 'horizontal') {
                if (placeHolder.parentElement !== currentTarget) {
                    currentTarget.appendChild(placeHolder);
                }
            } else if (isLayout === 'vertical') {
                if (placeHolder.parentElement !== currentTarget) {
                    currentTarget.appendChild(placeHolder);
                }
            }
        }
    }
}