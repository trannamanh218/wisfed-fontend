import defaultAvatar from 'assets/images/avatar.jpeg';
import PropTypes from 'prop-types';
import './user-avatar.scss';

const UserAvatar = ({ avatarImage, name, size, handleClick, className, source }) => {
	return (
		<div
			onMouseEnter={e => (e.target.style.cursor = 'pointer')}
			className={`user-avatar user-avatar-${size} ${className ? className : ''}`}
			onClick={handleClick}
		>
			<img
				className='user-avatar__img'
				src={avatarImage || source || defaultAvatar}
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
	source: '',
};

UserAvatar.propTypes = {
	source: PropTypes.string,
	name: PropTypes.string,
	size: PropTypes.oneOf(['sm', 'mm', 'md', 'lg', 'xl']),
	handleClick: PropTypes.func,
	className: PropTypes.string,
	avatarImage: PropTypes.string,
};

export default UserAvatar;
