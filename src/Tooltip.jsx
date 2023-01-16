import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './styles.css';

function TooltipPortal({ children, targetParentElement }) {
    return createPortal(
        children,
        targetParentElement instanceof Element
        ? targetParentElement
        : window.document.body
    );
}

export const Tooltip = ({
    containerStyle,
    targetElement,
    targetParentElement = window.document.body,
    isOpen = false,
    preferredPositions = ['top', 'bottom', 'left', 'right'],
    paddingAroundTarget = 10,
    children,
}) => {
    const tooltipContainerRef = useRef({});

    const setTooltipX = (x) => {
        tooltipContainerRef.current.style.setProperty('--x', `${x}px`);
    };

    const setTooltipY = (y) => {
        tooltipContainerRef.current.style.setProperty('--y', `${y}px`);
    };

    const setIsOpen = (visible) => {
        tooltipContainerRef.current.style.setProperty(
            'visibility',
            visible ? 'visible' : 'hidden'
        );
    };

    useEffect(() => {
        setIsOpen(isOpen);
    }, [isOpen]);

    useLayoutEffect(() => {
        if (!targetElement?.getBoundingClientRect ||
            !targetParentElement?.getBoundingClientRect) {
            if (isOpen) {
                console.error("Unexpected error with ref's while trying to open the tooltip");
            }
            return;
        }

        const targetParentRect = targetParentElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltipContainerRef.current.getBoundingClientRect();

        if (isOpen && targetParentRect) {
            const hasSpace = {
                left:
                    (targetRect.left - (targetParentRect.left || 0))
                    > (tooltipRect.width + paddingAroundTarget),
                right:
                    ((targetParentRect.right || 0) - targetRect.right)
                    > (tooltipRect.width + paddingAroundTarget),
                top:
                    (targetRect.top - (targetParentRect.top || 0))
                    > (tooltipRect.height + paddingAroundTarget),
                bottom:
                    ((targetParentRect.bottom || 0) - targetRect.bottom)
                    > (tooltipRect.height + paddingAroundTarget),
            };

            let finalPosition = preferredPositions.find((position) => hasSpace[position]);

            if (!finalPosition) {
                [finalPosition] = preferredPositions;
            }

            const xToResetTooltip = targetRect.x;
            const yToResetTooltip = targetRect.y;

            const adjustTopAndBottomForHorizontalPositions = (spaceToCentralize) => {
                if (targetRect.height > tooltipRect.height) {
                    return yToResetTooltip - spaceToCentralize;
                }

                const spaceToTop = (targetRect.y - spaceToCentralize) - targetParentRect.y;
                const spaceToBottom
                    = targetParentRect.y + targetParentRect.height
                    - (targetRect.y + targetRect.height + spaceToCentralize);

                if (spaceToTop < 0) {
                    return (yToResetTooltip - spaceToCentralize) - spaceToTop + paddingAroundTarget;
                }

                if (spaceToBottom < 0) {
                    return (yToResetTooltip - spaceToCentralize) + (spaceToBottom - paddingAroundTarget);
                }

                return yToResetTooltip - spaceToCentralize;
            };

            const adjustRightAndLeftForVerticalPositions = (spaceToCentralize) => {
                if (targetRect.width > tooltipRect.width) {
                    return xToResetTooltip - spaceToCentralize;
                }

                const spaceToLeft = (targetRect.x - spaceToCentralize) - targetParentRect.x;
                const spaceToRight
                    = targetParentRect.x + targetParentRect.width
                    - (targetRect.x + targetRect.width + spaceToCentralize);

                if (spaceToLeft < 0) {
                    return (xToResetTooltip - spaceToCentralize) - spaceToLeft + paddingAroundTarget;
                }

                if (spaceToRight < 0) {
                    return (xToResetTooltip - spaceToCentralize) + (spaceToRight - paddingAroundTarget);
                }

                return xToResetTooltip - spaceToCentralize;
            };

            const defineCoordinates = {
                left: () => {
                    const spaceToCentralize = Math.round(((tooltipRect.height - targetRect.height) / 2));
                    const newX = xToResetTooltip - (tooltipRect.width + paddingAroundTarget);
                    const newY = adjustTopAndBottomForHorizontalPositions(spaceToCentralize);

                    return { x: newX, y: newY };
                },
                right: () => {
                    const spaceToCentralize = Math.round(((tooltipRect.height - targetRect.height) / 2));
                    const newX = xToResetTooltip + (targetRect.width + paddingAroundTarget);
                    const newY = adjustTopAndBottomForHorizontalPositions(spaceToCentralize);

                    return { x: newX, y: newY };
                },
                top: () => {
                    const spaceToCentralize = Math.round(((tooltipRect.width - targetRect.width) / 2));
                    const newX = adjustRightAndLeftForVerticalPositions(spaceToCentralize);
                    const newY = yToResetTooltip - (tooltipRect.height + paddingAroundTarget);

                    return { x: newX, y: newY };
                },
                bottom: () => {
                    const spaceToCentralize = Math.round(((tooltipRect.width - targetRect.width) / 2));
                    const newX = adjustRightAndLeftForVerticalPositions(spaceToCentralize);
                    const newY = yToResetTooltip + (targetRect.height + paddingAroundTarget);

                    return { x: newX, y: newY };
                },
            };

            const { x, y } = defineCoordinates[finalPosition]();

            setTooltipX(x);
            setTooltipY(y);
        } else {
            setTooltipX(tooltipRect.x);
            setTooltipY(tooltipRect.y);
        }
    }, [
        targetElement,
        targetParentElement,
        isOpen,
        preferredPositions,
        paddingAroundTarget,
    ]);

    return (
        <TooltipPortal
            targetParentElement={targetParentElement}
        >
            <div
                style={containerStyle}
                ref={tooltipContainerRef}
                className="tulitipContainer"
            >
                {children}
            </div>
        </TooltipPortal>
    );
};
