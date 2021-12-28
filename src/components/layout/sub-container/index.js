import React from 'react';
import PropsTypes from 'prop-types';
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
	left: PropsTypes.any.isRequired,
	main: PropsTypes.any.isRequired,
	right: PropsTypes.any.isRequired,
};

export default SubContainer;
