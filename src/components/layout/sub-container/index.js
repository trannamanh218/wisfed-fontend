import { useState } from 'react';
import PropTypes from 'prop-types';
import './sub-container.scss';
import Layout from '..';
import { ErrorBoundary } from 'react-error-boundary';
import classNames from 'classnames';

const SubContainer = ({ left, main, right }) => {
	const [showLeftScrollbar, setShowLeftScrollbar] = useState(false);

	function ErrorFallback() {
		return (
			<div>
				<p>Máy chủ không phản hồi</p>
			</div>
		);
	}

	return (
		<Layout>
			<div className='subContainer'>
				<div className='subContainer__sidebar-wrapper left'>
					<div
						className={classNames('subContainer__left', { 'show-scrollbar': showLeftScrollbar })}
						onMouseOver={() => setShowLeftScrollbar(true)}
						onMouseLeave={() => setShowLeftScrollbar(false)}
					>
						<ErrorBoundary FallbackComponent={ErrorFallback}>{left}</ErrorBoundary>
					</div>
				</div>
				<div className='subContainer__main'>{main}</div>
				<div className='subContainer__sidebar-wrapper right'>
					<div className='subContainer__right'>{right}</div>
				</div>
			</div>
		</Layout>
	);
};

SubContainer.propTypes = {
	left: PropTypes.any.isRequired,
	main: PropTypes.any.isRequired,
	right: PropTypes.any.isRequired,
};

export default SubContainer;
