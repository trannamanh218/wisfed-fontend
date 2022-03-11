import React from 'react';
import backArrow from 'assets/images/back-arrow.png';
import PropTypes from 'prop-types';
import './back-button.scss';

const BackButton = () => {
	return (
		<div className='back-btn'>
			<img src={backArrow} alt='back' />
		</div>
	);
};

BackButton.propTypes = {
	handleClick: PropTypes.func,
};

export default BackButton;
