import PropTypes from 'prop-types';
import './Hamburger-modal.scss';
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CloseButtonIcon } from '../../svg/index';
const HamburgerModal = ({ isHamburgerShow, setIsHamburgerShow, userInfo }) => {
	const hamburgerRef = useRef(null);
	const optionsList = [
		{ text: 'Bảng xếp hạng', to: '/top100' },
		{ text: 'Mục tiêu đọc sách', to: `/reading-target/${userInfo.id}` },
		{ text: 'Quotes', to: '/quotes/all' },
	];

	useEffect(() => {
		function handleClickOutside(event) {
			if (hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
				setIsHamburgerShow(false);
			}
		}
		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [hamburgerRef, userInfo]);

	return (
		<div ref={hamburgerRef} className={`hamburger-modal ${isHamburgerShow ? 'show' : ''}`}>
			<button className='button-hamburger-close' onClick={() => setIsHamburgerShow(false)}>
				<CloseButtonIcon />
			</button>
			{optionsList.map((item, index) => (
				<Link to={item.to} className='button-hamburger-options' key={index}>
					<span>{item.text}</span>
				</Link>
			))}
		</div>
	);
};

HamburgerModal.propTypes = {
	isHamburgerShow: PropTypes.bool,
	setIsHamburgerShow: PropTypes.func,
	userInfo: PropTypes.object,
};
export default HamburgerModal;
