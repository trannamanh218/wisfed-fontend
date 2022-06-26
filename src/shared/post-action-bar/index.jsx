import PropTypes from 'prop-types';
import { CommentSvg, Like, LikeFill, Share } from 'components/svg';
import './post-action-bar.scss';
import { useDispatch } from 'react-redux';
import { sharePosts, saveDataShare } from 'reducers/redux-utils/post';

const PostActionBar = ({ postData, handleLikeAction }) => {
	const dispatch = useDispatch();

	const handleShare = () => {
		dispatch(sharePosts(true));
		dispatch(saveDataShare(postData));
	};

	return (
		<div className='post-action-bar'>
			<div data-testid='post__options__like-btn' className='post-action-bar__item' onClick={handleLikeAction}>
				{postData.isLike ? <LikeFill /> : <Like />}
				<div className='post-action-bar__title'>{postData.like || 0} Thích</div>
			</div>
			<div className='post-action-bar__item'>
				<CommentSvg />
				<div className='post-action-bar__title'>{postData.comments || 0} Bình luận</div>
			</div>
			<div onClick={handleShare} className='post-action-bar__item'>
				<Share />
				<div className='post-action-bar__title'>{postData.share || 0} Chia sẻ</div>
			</div>
		</div>
	);
};

PostActionBar.defaultProps = {
	postData: {
		like: 0,
		comments: 0,
		share: 0,
	},
	handleLikeAction: () => {},
};

PostActionBar.propTypes = {
	postData: PropTypes.object.isRequired,
	handleLikeAction: PropTypes.func,
};

export default PostActionBar;
