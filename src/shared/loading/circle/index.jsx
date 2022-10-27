import PropTypes from 'prop-types';
import BaseLoading from '../base';
import LoadingIndicator from 'shared/loading-indicator';
import React from 'react';
function Circle({ loading = true }) {
	return (
		<BaseLoading loading={loading}>
			<LoadingIndicator />
		</BaseLoading>
	);
}

Circle.propTypes = {
	loading: PropTypes.bool,
};

export default React.memo(Circle);
