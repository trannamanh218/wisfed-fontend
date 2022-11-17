import Header from 'components/header';
import PropTypes from 'prop-types';
import './layout.scss';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Layout = ({ children }) => {
	useEffect(() => {
		window.history.scrollRestoration = 'manual';
	}, []);

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
