import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const Typing = () => {
    const typedRef = useRef(null);

    useEffect(() => {
        const options = {
            strings: ['organized with your Codes.', 'always ready to Code.', 'accurate and Optimized.', 'with us to Explore More.'],
            typeSpeed: 30,
            backSpeed: 15,
            loop: true,
        };
        const typed = new Typed(typedRef.current, options);
        return () => {
            typed.destroy();
        };
    }, []);

    return <span className='font-mono' ref={typedRef}></span>;
};

export default Typing;
