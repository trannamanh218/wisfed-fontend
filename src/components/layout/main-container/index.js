import PropTypes from 'prop-types';
import './main-container.scss';
import Layout from '..';
import { ErrorBoundary } from 'react-error-boundary';
import { useState } from 'react';
import classNames from 'classnames';

const MainContainer = ({ main, right }) => {
	const [showSidebarcrollbar, setShowSidebarScrollbar] = useState(false);

	const ErrorFallback = () => {
		return (
			<div>
				<p>Máy chủ không phản hồi</p>
			</div>
		);
	};

	return (
		<Layout>
			<div className='mainContainer'>
				<div className='mainContainer__main'>
					<ErrorBoundary FallbackComponent={ErrorFallback}>{main}</ErrorBoundary>
				</div>
				<div className='mainContainer__sidebar-wrapper'>
					<div
						className={classNames('mainContainer__right', { 'show-scrollbar': showSidebarcrollbar })}
						onMouseOver={() => setShowSidebarScrollbar(true)}
						onMouseLeave={() => setShowSidebarScrollbar(false)}
					>
						<ErrorBoundary FallbackComponent={ErrorFallback}>{right}</ErrorBoundary>
					</div>
				</div>
			</div>
		</Layout>
	);
};

MainContainer.propTypes = {
	main: PropTypes.any.isRequired,
	right: PropTypes.any.isRequired,
};

export default MainContainer;
