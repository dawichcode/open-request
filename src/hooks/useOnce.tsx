import { useEffect, useRef } from 'react';

function useOnce(effect: () => void) {
    const hasRun = useRef(false);

    useEffect(() => {
        if (!hasRun.current) {
            effect();
            hasRun.current = true;
        }
    }, [effect]);
}

export default useOnce;
