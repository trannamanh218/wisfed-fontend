import React from 'react';
import PropsTypes from 'prop-types';
import './button.scss';
import classNames from 'classnames';

const Button = ({ content, handleClick, size, varient, isOutline }) => {
	const className = classNames({
		'btn': size === 'md',
		[`btn btn-${size}`]: size !== 'md',
		[`btn-outline-${varient}`]: isOutline,
		[`btn-${varient}`]: !isOutline,
	});

	return (
		<button className={className} onClick={handleClick}>
			{content}
		</button>
	);
};

Button.defaultProps = {
	content: 'Click  me!',
	handleClick: () => {},
	size: 'md',
	varient: 'primary',
	isOutline: false,
};

Button.propTypes = {
	content: PropsTypes.string.isRequired,
	handleClick: PropsTypes.func,
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
};

export default Button;
