import PropTypes from 'prop-types';
import './layout.scss';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Layout = ({ children }) => {
	useEffect(() => {
		window.scroll(0, 0);
	}, []);

	const handleBackgroundToggle = useSelector(state => state.notificationReducer.toggle);

	return (
		<div className='layout'>
			{handleBackgroundToggle === false && <div className='header__dard'></div>}
			{children}
		</div>
	);
};

Layout.propTypes = {
	children: PropTypes.any.isRequired,
};

export default Layout;
