import React from 'react';
import defaultAvatar from 'assets/images/avatar.jpeg';
import PropTypes from 'prop-types';
import './user-avatar.scss';

const UserAvatar = ({ avatarImage, name, size, handleClick, className }) => {
	return (
		<div className={`user-avatar user-avatar-${size} ${className ? className : ''}`} onClick={handleClick}>
			<img
				className='user-avatar__img'
				src={avatarImage || defaultAvatar}
				alt={name}
				onError={e => e.target.setAttribute('src', `${defaultAvatar}`)}
			/>
		</div>
	);
};

UserAvatar.defaultProps = {
	name: 'avatar',
	size: 'md',
	handleClick: () => {},
	avatarImage: '',
};

UserAvatar.propTypes = {
	source: PropTypes.string.isRequired,
	name: PropTypes.string,
	size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
	handleClick: PropTypes.func,
	className: PropTypes.string,
	avatarImage: PropTypes.string,
};

export default UserAvatar;
