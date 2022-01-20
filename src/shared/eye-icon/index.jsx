import React from 'react';
import eyeIcon from 'assets/images/eye.svg';
import hideEyeIcon from 'assets/images/hide-eye.svg';
import PropsTypes from 'prop-types';
import './eye-icon.scss';

const EyeIcon = ({ isPublic, handlePublic }) => {
	return <img className='eye-icon' src={isPublic ? eyeIcon : hideEyeIcon} alt='eye' onClick={handlePublic} />;
};

EyeIcon.defaultProps = {
	isPublic: false,
	handlePublic: () => {},
};

EyeIcon.propTypes = {
	isPublic: PropsTypes.bool.isRequired,
	handlePublic: PropsTypes.func,
};

export default EyeIcon;
