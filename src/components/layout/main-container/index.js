import PropTypes from 'prop-types';
import './main-container.scss';
import Layout from '..';
import { ErrorBoundary } from 'react-error-boundary';

const MainContainer = ({ main, right, sub }) => {
	const ErrorFallback = () => {
		return (
			<div>
				<p>Máy chủ không phản hồi</p>
			</div>
		);
	};

	return (
		<Layout>
			{sub && <div className='subcontainer__sub'>{sub}</div>}
			<div className='mainContainer'>
				<div className='mainContainer__main'>
					<ErrorBoundary FallbackComponent={ErrorFallback}>{main}</ErrorBoundary>
				</div>
				<div className='mainContainer__right'>
					<ErrorBoundary FallbackComponent={ErrorFallback}>{right}</ErrorBoundary>
				</div>
			</div>
		</Layout>
	);
};

MainContainer.propTypes = {
	main: PropTypes.any.isRequired,
	right: PropTypes.any.isRequired,
	sub: PropTypes.any,
};

export default MainContainer;
