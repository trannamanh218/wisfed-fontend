import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './modal-portal.scss';

const ModalPortal = ({ children, isOpen = false }) => {
	const modalRef = useRef();
	useEffect(() => {
		const body = document.querySelector('body');

		if (modalRef.current) {
			body.classList.add('modal-portal-open');
		} else {
			body.classList.remove('modal-portal-open');
		}

		if (!isOpen) {
			body.classList.remove('modal-portal-open');
		}
	}, []);

	if (isOpen) {
		return ReactDOM.createPortal(
			<div ref={modalRef} className='modal-portal'>
				{children}
			</div>,
			document.querySelector('body')
		);
	}

	return '';
};

ModalPortal.propTypes = {
	children: PropTypes.any,
	isOpen: PropTypes.bool,
};

export default ModalPortal;
