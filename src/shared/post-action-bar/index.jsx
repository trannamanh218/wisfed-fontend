import PropTypes from 'prop-types';
import { CommentSvg, Like, LikeFill, Share } from 'components/svg';
import './post-action-bar.scss';
import { saveDataShare } from 'reducers/redux-utils/post';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	POST_VERB,
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB,
	GROUP_POST_VERB_SHARE,
	READ_TARGET_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_USER_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	MY_BOOK_VERB_SHARE,
} from 'constants';

const PostActionBar = ({ postData, handleLikeAction }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const currentGroupArrived = useSelector(state => state.group.currentGroupArrived);

	const handleShare = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			let dataToShare;
			if (postData.verb === POST_VERB || postData.verb === POST_VERB_SHARE) {
				if (postData.verb === POST_VERB) {
					dataToShare = {
						...postData,
						type: 'post',
						sharePost: { ...postData },
						verb: POST_VERB_SHARE,
					};
				} else {
					dataToShare = {
						...postData,
						type: 'postShare',
						verb: POST_VERB_SHARE,
					};
				}
			} else if (postData.verb === QUOTE_VERB_SHARE) {
				dataToShare = {
					type: 'quote',
					...postData.sharePost,
					verb: QUOTE_VERB_SHARE,
				};
			} else if (
				location.pathname.includes('group') ||
				postData.verb === GROUP_POST_VERB ||
				postData.verb === GROUP_POST_VERB_SHARE
			) {
				if (postData.verb === GROUP_POST_VERB_SHARE) {
					dataToShare = {
						verb: GROUP_POST_VERB_SHARE,
						...postData,
					};
				} else if (postData.verb === GROUP_POST_VERB) {
					dataToShare = {
						verb: GROUP_POST_VERB_SHARE,
						group: postData.group,
						sharePost: { ...postData },
					};
				} else {
					dataToShare = {
						verb: GROUP_POST_VERB_SHARE,
						group: currentGroupArrived,
						sharePost: { ...postData },
					};
				}
			} else if (postData.verb === READ_TARGET_VERB_SHARE) {
				const percentTemp = ((postData.currentRead / postData.totalTarget) * 100).toFixed();
				dataToShare = {
					numberBook: postData.totalTarget,
					booksReadCount: postData.currentRead,
					percent: percentTemp > 100 ? 100 : percentTemp,
					verb: READ_TARGET_VERB_SHARE,
				};
			} else if (postData.verb === TOP_USER_VERB_SHARE) {
				dataToShare = {
					by: postData.originId.by,
					categoryId: postData.originId.categoryId || null,
					userType: postData.originId.userType,
					categoryName: postData.info?.category?.name,
					type: postData.originId.type,
					id: postData.info.id,
					trueRank: postData.originId.rank,
					verb: TOP_USER_VERB_SHARE,
					...postData.info,
				};
			} else if (postData.verb === TOP_BOOK_VERB_SHARE) {
				dataToShare = {
					by: postData.originId.by,
					categoryId: postData.originId.categoryId || null,
					categoryName: postData.info?.category?.name,
					type: postData.originId.type,
					id: postData.info.id,
					verb: TOP_BOOK_VERB_SHARE,
					trueRank: postData.originId.rank,
					...postData.info,
				};
			} else if (postData.verb === TOP_QUOTE_VERB_SHARE) {
				dataToShare = {
					by: postData.originId.by,
					categoryId: postData.originId.categoryId || null,
					categoryName: postData.info?.category?.name,
					type: postData.originId.type,
					id: postData.info.id,
					verb: TOP_QUOTE_VERB_SHARE,
					trueRank: postData.originId.rank,
					...postData.info,
				};
			} else if (postData.verb === MY_BOOK_VERB_SHARE) {
				dataToShare = {
					id: postData.info.id,
					verb: MY_BOOK_VERB_SHARE,
					type: postData.originId.type,
					...postData.info,
				};
			}
			dispatch(saveDataShare(dataToShare));
			if (!location.pathname.includes('group')) {
				navigate('/');
			}
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

	return (
		<div className='post-action-bar'>
			<div data-testid='post__options__like-btn' className='post-action-bar__item' onClick={handleLikeAction}>
				{postData.isLike ? <LikeFill /> : <Like />}
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
