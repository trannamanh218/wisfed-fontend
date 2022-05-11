import React from 'react';
import PropTypes from 'prop-types';

const WrapIcon = ({ component: Component, ...rest }) => {
	return (
		<span>
			<Component {...rest} />
		</span>
	);
};

WrapIcon.propTypes = {
	component: PropTypes.any.isRequired,
	rest: PropTypes.any,
};

export default WrapIcon;
