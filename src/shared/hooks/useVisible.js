import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

function useVisible(initialIsVisible) {
	const [isVisible, setIsVisible] = useState(initialIsVisible);
	const { isShowModal } = useSelector(state => state.search);
	const ref = useRef(null);

	const handleClickOutside = e => {
		if (ref.current && !ref.current.contains(e.target)) {
			setIsVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	return { ref, isVisible, setIsVisible };
}

export default useVisible;
