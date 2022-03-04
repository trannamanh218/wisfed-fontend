import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './modal-portal.scss';

const ModalPortal = ({ children, isOpen }) => {
	const modalRef = useRef();
	useEffect(() => {
		const body = document.querySelector('body');
		const modalPortal = document.querySelector('.modal-portal.show');

		if (modalPortal) {
			body.classList.add('modal-portal-open');
		} else {
			body.classList.remove('modal-portal-open');
		}
	}, [isOpen]);

	if (isOpen) {
		return ReactDOM.createPortal(
			<div ref={modalRef} className={classNames('modal-portal', { 'show': isOpen, 'hide': !isOpen })}>
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
