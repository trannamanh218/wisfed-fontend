import React from 'react';
import defaultAvatar from 'assets/images/avatar.jpeg';
import PropTypes from 'prop-types';
import './user-avatar.scss';

const UserAvatar = ({ source, name, size, handleClick, className }) => {
	return (
		<div className={`user-avatar user-avatar-${size} ${className ? className : null}`} onClick={handleClick}>
			<img
				className='user-avatar__img'
				src={source || defaultAvatar}
				alt={name}
				onError={e => e.target.setAttribute('src', `${defaultAvatar}`)}
			/>
		</div>
	);
};

UserAvatar.defaultProps = {
	source: '',
	name: 'avatar',
	size: 'md',
	handleClick: () => {},
};

UserAvatar.propTypes = {
	source: PropTypes.string.isRequired,
	name: PropTypes.string,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
	handleClick: PropTypes.func,
	className: PropTypes.string,
};

export default UserAvatar;
