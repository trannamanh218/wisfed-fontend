import React from 'react';
import { Badge } from 'react-bootstrap';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import './comment.scss';

const Comment = props => {
	const { data, handleReply, handleLike } = props;
	const { isAuthor, author, content, duration, avatar } = data;
	return (
		<div className='comment'>
			<UserAvatar className='comment__avatar' size='sm' source={avatar} />
			<div className='comment__wrapper'>
				<div className='comment__container'>
					<span className='comment__author'>{author}</span>
					{isAuthor && (
						<Badge className='comment__badge' bg='primary-light'>
							Tác giả
						</Badge>
					)}
					<p className='comment__content'>{content}</p>
				</div>
				<ul className='comment__action'>
					<li className='comment__item' onClick={handleLike}>
						Thích
					</li>
					<li className='comment__item' onClick={handleReply}>
						Phản hồi
					</li>
					<li className='comment__item comment__item--timeline'>{`${duration} giờ`}</li>
				</ul>
			</div>
		</div>
	);
};

Comment.defaultProps = {
	data: {
		avatar: '',
		isAuthor: true,
		author: 'User name 1',
		content: `ipsum dolor sit amet consectetur adipisicing elit. Quidem eum error totam, iusto mollitia
		nemo minus corporis deleniti ut minima?`,
		duration: 16,
	},
	handleLike: () => {},
	handleReply: () => {},
};

Comment.propTypes = {
	data: PropTypes.shape({
		avatar: PropTypes.string,
		isAuthor: PropTypes.bool,
		author: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		duration: PropTypes.number.isRequired,
	}),
	handleLike: PropTypes.func,
	handleReply: PropTypes.func,
};

export default Comment;
