import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './input.scss';

const Input = ({ placeholder = 'Viết bình luận...', handleChange, isBorder = true, className = '', ...rest }) => {
	return (
		<input
			className={classNames(
				'input',
				{ 'input--non-border': !isBorder },
				{ 'input--border': isBorder },
				{ [`${className}`]: className }
			)}
			placeholder={placeholder}
			onChange={handleChange}
			{...rest}
		/>
	);
};

Input.propTypes = {
	placeholder: PropTypes.string.isRequired,
	handleChange: PropTypes.func,
	isBorder: PropTypes.bool,
	className: PropTypes.string,
};

export default Input;
