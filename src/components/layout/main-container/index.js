import PropTypes from 'prop-types';
import './main-container.scss';
import Layout from '..';

const MainContainer = ({ main, right }) => {
	return (
		<Layout>
			<div className='mainContainer'>
				<div className='mainContainer__main'>{main}</div>
				<div className='mainContainer__right'>{right}</div>
			</div>
		</Layout>
	);
};

MainContainer.propTypes = {
	main: PropTypes.any.isRequired,
	right: PropTypes.any.isRequired,
};

export default MainContainer;
