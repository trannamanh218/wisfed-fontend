import React from 'react';
import PropTypes from 'prop-types';
import './main-container.scss';

const MainContainer = ({ main, right }) => {
	return (
		<div className='mainContainer'>
			<div className='mainContainer__main'>{main}</div>
			<div className='mainContainer__right'>{right}</div>
		</div>
	);
};

MainContainer.propTypes = {
	main: PropTypes.any.isRequired,
	right: PropTypes.any.isRequired,
};

export default MainContainer;
