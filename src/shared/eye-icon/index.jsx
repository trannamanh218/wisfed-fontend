import React from 'react';
import PropTypes from 'prop-types';
import { Eye, HiddenEye } from 'components/svg';
import './eye-icon.scss';

const EyeIcon = ({ isPublic, handlePublic }) => {
	return (
		<span className='eye-icon' onClick={handlePublic}>
			{isPublic ? <Eye /> : <HiddenEye />}
		</span>
	);
};

EyeIcon.defaultProps = {
	isPublic: false,
	handlePublic: () => {},
};

EyeIcon.propTypes = {
	isPublic: PropTypes.bool.isRequired,
	handlePublic: PropTypes.func,
};

export default EyeIcon;
