import React from 'react';
import backArrow from 'assets/images/back-arrow.png';
import PropTypes from 'prop-types';
import './back-button.scss';

const BackButton = ({ handleClick }) => {
	return (
		<button className='back-btn' onClick={handleClick}>
			<img src={backArrow} alt='back' />
		</button>
	);
};

BackButton.propTypes = {
	handleClick: PropTypes.func,
};

export default BackButton;
