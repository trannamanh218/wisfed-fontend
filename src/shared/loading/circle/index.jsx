import React from 'react';
import PropTypes from 'prop-types';
import BaseLoading from '../base';
import LoadingIndicator from 'shared/loading-indicator';

function Circle({ loading }) {
	return (
		<BaseLoading loading={loading}>
			<LoadingIndicator />
		</BaseLoading>
	);
}

Circle.propTypes = {
	loading: PropTypes.bool,
};

export default Circle;
