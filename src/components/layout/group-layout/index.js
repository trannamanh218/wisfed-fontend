import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

const GroupPageLayout = ({ main, right, sub }) => {
	const ErrorFallback = () => {
		return (
			<div>
				<p>Máy chủ không phản hồi</p>
			</div>
		);
	};

	return (
		<>
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
		</>
	);
};

GroupPageLayout.propTypes = {
	main: PropTypes.any.isRequired,
	right: PropTypes.any,
	sub: PropTypes.any,
};

export default GroupPageLayout;
