import PropTypes from 'prop-types';
import '../main-container/main-container.scss';
import Layout from '..';
import { ErrorBoundary } from 'react-error-boundary';

const MainContainerLeft = ({ main, right, sub }) => {
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
				{right && (
					<div className='mainContainer__right-left'>
						<ErrorBoundary FallbackComponent={ErrorFallback}>{right}</ErrorBoundary>
					</div>
				)}

				<div className='mainContainer__main-left'>
					<ErrorBoundary FallbackComponent={ErrorFallback}>{main}</ErrorBoundary>
				</div>
			</div>
		</Layout>
	);
};

MainContainerLeft.propTypes = {
	main: PropTypes.any.isRequired,
	right: PropTypes.any.isRequired,
	sub: PropTypes.any,
};

export default MainContainerLeft;
