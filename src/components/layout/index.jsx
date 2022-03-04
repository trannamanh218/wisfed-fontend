import Header from 'components/header';
import React from 'react';
import PropTypes from 'prop-types';
import './layout.scss';

const Layout = ({ children }) => {
	return (
		<div className='layout'>
			<Header />
			<div className='layout__container'>{children}</div>
		</div>
	);
};

Layout.propTypes = {
	children: PropTypes.any.isRequired,
};

export default Layout;
