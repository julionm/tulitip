import { useRef, useState } from 'react';

import Tooltip from '../../../../../src/Tooltip';
import './styles.css';

export function Sample01 () {
    const [isOpen, setIsOpen] = useState(false);

    const targetRef = useRef({});
    const parentTargetRef = useRef({});

    return (
        <div ref={parentTargetRef} className='container'>
            <div
                ref={targetRef}
                className='target'
                onClick={
                    () => setIsOpen(!isOpen)
                }
            ></div>

            <Tooltip
                targetElement={targetRef.current}
                isOpen={isOpen}
                preferredPositions={['bottom', 'top', 'left', 'right']}
                targetParentElement={parentTargetRef.current}
                paddingAroundTarget={10}
            >
                <div className='tooltipContainer'>
                    <span>Deu Certo!</span>
                </div>
            </Tooltip>
        </div>
    );
}
