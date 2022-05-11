import React from 'react';
import PropTypes from 'prop-types';
import Layout from '..';

const NormalContainer = ({ children }) => {
	return (
		<Layout>
			<div>{children}</div>
		</Layout>
	);
};

NormalContainer.propTypes = {
	children: PropTypes.any.isRequired,
};

export default NormalContainer;
