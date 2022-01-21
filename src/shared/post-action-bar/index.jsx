import React from 'react';
import PropsTypes from 'prop-types';
import { Like, Comment, Share, LikeFill } from 'components/svg';
import './post-action-bar.scss';

const PostActionBar = ({ postInformations, likeAction }) => {
	return (
		<div className='post-action-bar'>
			<div
				data-testid='post__options__like-btn'
				className='post-action-bar__item'
				onClick={() => likeAction(postInformations)}
			>
				{postInformations.isLike ? <LikeFill /> : <Like />}
				<div className='post-action-bar__title'>{postInformations.likeNumber} Thích</div>
			</div>
			<div className='post-action-bar__item'>
				<Comment />
				<div className='post-action-bar__title'>{postInformations.commentNumber} Bình luận</div>
			</div>
			<div className='post-action-bar__item'>
				<Share />
				<div className='post-action-bar__title'>{postInformations.shareNumber} Chia sẻ</div>
			</div>
		</div>
	);
};

PostActionBar.defaultProps = {
	postInformations: {
		isLike: false,
		likeNumber: 0,
		commentNumber: 0,
		shareNumber: 0,
	},
	likeAction: () => {},
};

PostActionBar.propTypes = {
	postInformations: PropsTypes.object.isRequired,
	likeAction: PropsTypes.func,
};

export default PostActionBar;
