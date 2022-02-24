import React from 'react';
import PropTypes from 'prop-types';
import BaseLoading from '../base';
import brickIcon from 'assets/icons/brick.svg';

function Brick({ loading }) {
	return (
		<BaseLoading loading={loading}>
			<img className='brick-loading' src={brickIcon} alt='loading' />
		</BaseLoading>
	);
}

Brick.propTypes = {
	loading: PropTypes.bool,
};

export default Brick;
