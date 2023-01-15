# tulitip

This is a simple Tooltip created for studies purpose.

It has some repositioning logic based on the target's specified parent, if none is passed, it assumes the body as it's parent.

The usage is basically:

```javascript

import { useRef, useState } from 'react';

import Tooltip from '../../Tooltip';
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
                containerStyle={
                    { "z-index": "-1" }
                }
            >
                <div className='tooltipContainer'>
                    <span>My Tooltip!</span>
                </div>
            </Tooltip>
        </div>
    );
}

```
