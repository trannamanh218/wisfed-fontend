import React from 'react';
import PropsTypes from 'prop-types';
import { Like, Comment, Share } from 'components/svg';
import './post-action-bar.scss';
import classNames from 'classnames';

const PostActionBar = ({ data, handleLikeStatus }) => {
	const { isLike, likeNumbers, commentNumbers, shareNumbers } = data;

	return (
		<div className='post-action-bar'>
			<div className='post-action-bar__item '>
				<Like className={classNames('like-icon', { 'active': isLike })} onClick={handleLikeStatus} />
				<div className='post-action-bar__title'>{likeNumbers} Thích</div>
			</div>
			<div className='post-action-bar__item'>
				<Comment />
				<div className='post-action-bar__title'>{commentNumbers} Bình luận</div>
			</div>
			<div className='post-action-bar__item'>
				<Share />
				<div className='post-action-bar__title'>{shareNumbers} Chia sẻ</div>
			</div>
		</div>
	);
};

PostActionBar.defaultProps = {
	data: {
		isLike: false,
		likeNumbers: 0,
		commentNumbers: 0,
		shareNumbers: 0,
	},
	handleLikeStatus: () => {},
};

PostActionBar.propTypes = {
	data: PropsTypes.object.isRequired,
	handleLikeStatus: PropsTypes.func,
};

export default PostActionBar;
