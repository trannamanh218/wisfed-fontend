import React from 'react';
import PropsTypes from 'prop-types';
import './button.scss';
import classNames from 'classnames';

const Button = ({ children, onClick, size, varient, isOutline, className }) => {
	const classNameButton = classNames({
		'btn': size === 'md',
		[`btn btn-${size}`]: size !== 'md',
		[`btn-outline-${varient}`]: isOutline,
		[`btn-${varient}`]: !isOutline,
		[`${className}`]: className,
	});

	return (
		<button className={classNameButton} onClick={onClick}>
			{children}
		</button>
	);
};

Button.defaultProps = {
	children: 'Click  me!',
	onClick: () => {},
	size: 'md',
	varient: 'primary',
	isOutline: false,
	className: '',
};

Button.propTypes = {
	children: PropsTypes.node.isRequired,
	onClick: PropsTypes.func,
	size: PropsTypes.oneOf(['sm', 'md', 'lg']),
	varient: PropsTypes.oneOf([
		'primary',
		'primary-light',
		'primary-dark',
		'secondary',
		'success',
		'success-dark',
		'warning',
		'info',
		'light',
		'dark',
	]),
	isOutline: PropsTypes.bool,
	className: PropsTypes.string,
};

export default Button;
