import React from 'react';
import PropTypes from 'prop-types';
import './sub-container.scss';
import Layout from '..';

const SubContainer = ({ left, main, right, sub }) => {
	return (
		<Layout>
			{sub && <div className='subcontainer__sub'>{sub}</div>}
			<div className='subContainer'>
				<div className='subContainer__left'>{left}</div>
				<div className='subContainer__main'>{main}</div>
				<div className='subContainer__right'>{right}</div>
			</div>
		</Layout>
	);
};

SubContainer.propTypes = {
	left: PropTypes.any.isRequired,
	main: PropTypes.any.isRequired,
	right: PropTypes.any.isRequired,
	sub: PropTypes.any,
};

export default SubContainer;
