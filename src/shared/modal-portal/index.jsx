import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './modal-portal.scss';

const ModalPortal = ({ children, isOpen }) => {
	if (isOpen) {
		return ReactDOM.createPortal(
			<div className={classNames('modal-portal', { 'show': isOpen, 'hide': !isOpen })}>{children}</div>,
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
