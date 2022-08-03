import PropTypes from 'prop-types';
import { CommentSvg, Like, LikeFill, Share } from 'components/svg';
import './post-action-bar.scss';
import { sharePosts, saveDataShare } from 'reducers/redux-utils/post';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const PostActionBar = ({ postData, handleLikeAction }) => {
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const { userInfo } = useSelector(state => state.auth);

	const handleShare = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			if (location.pathname.includes('/detail-feed')) {
				navigate('/');
			}
			dispatch(sharePosts(true));
			dispatch(saveDataShare(postData));
		}
	};

	const handleCommentPost = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			const commentEditField = document.querySelector(`.comment-editor-last-${postData.id}`);
			if (commentEditField) {
				setTimeout(() => {
					window.scroll({
						top: commentEditField.offsetTop - 400,
						behavior: 'smooth',
					});
				}, 200);
			}
			const editorChild = commentEditField.querySelector('.public-DraftEditor-content');
			if (editorChild) {
				editorChild.focus();
			}
		}
	};
	console.log(postData.usersLikePost);
	return (
		<div className='post-action-bar'>
			<div data-testid='post__options__like-btn' className='post-action-bar__item' onClick={handleLikeAction}>
				{postData.isLike ? (
					// postData.usersLikePost?.includes(postData.usersLikePost.find(x => x.id === userInfo.id))
					<LikeFill />
				) : (
					<Like />
				)}
				<div className='post-action-bar__title'>{postData.like || null} Thích</div>
			</div>

			<div className='post-action-bar__item' onClick={handleCommentPost}>
				<CommentSvg />
				<div className='post-action-bar__title'>{postData.comment || postData.comments || null} Bình luận</div>
			</div>
			<div onClick={handleShare} className='post-action-bar__item'>
				<Share />
				<div className='post-action-bar__title'>{postData.share || null} Chia sẻ</div>
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
