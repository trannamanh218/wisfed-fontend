import React from 'react';
import backArrow from 'assets/images/back-arrow.png';
import PropTypes from 'prop-types';
import './back-button.scss';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
	const navigate = useNavigate();
	const backFnc = () => {
		navigate(-1);
	};
	return (
		<button className='back-btn' onClick={backFnc}>
			<img src={backArrow} alt='back' />
		</button>
	);
};

BackButton.propTypes = {
	handleClick: PropTypes.func,
};

export default BackButton;
