import Header from 'components/header';
import React from 'react';
import PropTypes from 'prop-types';
import './layout.scss';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
	const handleBackgroundToggle = useSelector(state => state.notificationReducer.toggle);
	return (
		<div className='layout'>
			<Header />
			<div className='layout__container'>
				{handleBackgroundToggle === false && <div className='header__dard'></div>}
				{children}
			</div>
		</div>
	);
};

Layout.propTypes = {
	children: PropTypes.any.isRequired,
};

export default Layout;
