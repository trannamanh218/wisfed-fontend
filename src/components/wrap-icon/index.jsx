import React from 'react';
import PropsTypes from 'prop-types';

const WrapIcon = ({ component: Component, ...rest }) => {
	return (
		<span>
			<Component {...rest} />
		</span>
	);
};

WrapIcon.propTypes = {
	component: PropsTypes.any.isRequired,
	rest: PropsTypes.any,
};

export default WrapIcon;
