import React from 'react';
import PropsTypes from 'prop-types';
import classNames from 'classnames';
import './input.scss';

const Input = ({ placeholder = 'Viết bình luận...', handleChange, backgroundColor = 'white', isBorder = true }) => {
	const style = {
		backgroundColor,
	};

	return (
		<input
			className={classNames('input', { 'input--non-border': !isBorder }, { 'input--border': isBorder })}
			style={style}
			placeholder={placeholder}
			onChange={handleChange}
		/>
	);
};

Input.propTypes = {
	placeholder: PropsTypes.string.isRequired,
	backgroundColor: PropsTypes.string,
	handleChange: PropsTypes.func,
	isBorder: PropsTypes.bool,
};

export default Input;
