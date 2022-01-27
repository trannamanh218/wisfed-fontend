import React from 'react';
import PropTypes from 'prop-types';
import './sub-container.scss';

const SubContainer = ({ left, main, right }) => {
	return (
		<div className='subContainer'>
			<div className='subContainer__left'>{left}</div>
			<div className='subContainer__main'>{main}</div>
			<div className='subContainer__right'>{right}</div>
		</div>
	);
};

SubContainer.propTypes = {
	left: PropTypes.any.isRequired,
	main: PropTypes.any.isRequired,
	right: PropTypes.any.isRequired,
};

export default SubContainer;
