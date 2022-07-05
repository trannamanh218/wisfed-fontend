import React from 'react';
import PropTypes from 'prop-types';
import './sub-container.scss';
import Layout from '..';
import { ErrorBoundary } from 'react-error-boundary';

const SubContainer = ({ left, main, right }) => {
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
				<div className='subContainer__left'>
					<ErrorBoundary FallbackComponent={ErrorFallback}>{left}</ErrorBoundary>
				</div>
				<div className='subContainer__main'>{main}</div>
				<div className='subContainer__right'>{right}</div>
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
