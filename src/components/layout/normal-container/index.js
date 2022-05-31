import React from 'react';
import PropTypes from 'prop-types';
import Layout from '..';
import { ErrorBoundary } from 'react-error-boundary';

const NormalContainer = ({ children }) => {
	const ErrorFallback = () => {
		return (
			<div>
				<p>Máy chú không phản hồi</p>
			</div>
		);
	};
	return (
		<Layout>
			<div>
				<ErrorBoundary FallbackComponent={ErrorFallback}> {children}</ErrorBoundary>
			</div>
		</Layout>
	);
};

NormalContainer.propTypes = {
	children: PropTypes.any.isRequired,
};

export default NormalContainer;
