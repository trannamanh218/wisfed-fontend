import React from 'react';
import PropsTypes from 'prop-types';
import './linear-progress-bar.scss';

const LinearProgressBar = ({ percent, variant, height }) => {
	const styleBar = {
		width: `${percent}%`,
	};

	const style = {
		height: `${height}rem`,
	};

	return (
		<div className='linear-progress' style={style}>
			<div className={`linear-progress-bar bg-${variant}`} style={styleBar}></div>
		</div>
	);
};

LinearProgressBar.defaultProps = {
	percent: 50,
	variant: 'primary',
	height: 0.5,
};

LinearProgressBar.propTypes = {
	percent: PropsTypes.number.isRequired,
	variant: PropsTypes.oneOf([
		'primary',
		'primary-light',
		'primary-dark',
		'secondary',
		'success',
		'success-light',
		'success-dark',
		'warning',
		'info',
		'light',
		'dark',
	]),
	height: PropsTypes.number,
};

export default LinearProgressBar;
