import React from 'react';
import PropsTypes from 'prop-types';
import './main-container.scss';

const MainContainer = ({ main, right}) => {
	return (
		<div className='mainContainer'>
			<div className='mainContainer__main'>
				{main}
			</div>
			<div className='mainContainer__right'>
				{right}
			</div>
		</div>
	);
};

MainContainer.propTypes = {
	main: PropsTypes.any.isRequired,
	right: PropsTypes.any.isRequired,
};


export default MainContainer;
