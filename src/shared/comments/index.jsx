import { useState, useEffect, useCallback, useRef } from 'react';
import classNames from 'classnames';
import { calculateDurationTime } from 'helpers/Common';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import './comment.scss';
import { likeQuoteComment } from 'reducers/redux-utils/quote';
import { NotificationError } from 'helpers/Error';
import { likeAndUnlikeCommentPost } from 'reducers/redux-utils/activity';
import { likeAndUnlikeCommentReview } from 'reducers/redux-utils/book';
import { POST_TYPE, QUOTE_TYPE, REVIEW_TYPE, urlRegex } from 'constants/index';
import { Link, useNavigate } from 'react-router-dom';
import { LikeComment } from 'components/svg';
import { likeAndUnlikeGroupComment } from 'reducers/redux-utils/group';
import DirectLinkALertModal from 'shared/direct-link-alert-modal';
import _ from 'lodash';
import ShowTime from 'shared/showTimeOfPostWhenHover/showTime';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import CommentEditor from 'shared/comment-editor';
import {
	updateCommentGroupPost,
	updateCommentMinipost,
	updateCommentQuote,
	updateCommentReview,
} from 'reducers/redux-utils/comment';
import { setParamHandleEdit } from 'reducers/redux-utils/comment';
import { useVisible } from 'shared/hooks';

const Comment = ({ dataProp, handleReply, postData, commentLv1Id, type }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isAuthor, setIsAuthor] = useState(false);
	const [data, setData] = useState(dataProp);
	const [modalShow, setModalShow] = useState(false);
	const [isEditingComment, setIsEditingComment] = useState(false);

	const urlToDirect = useRef('');
	const {
		ref: optionsCommentList,
		isVisible: showOptionsComment,
		setIsVisible: setShowOptionsComment,
	} = useVisible(false);

	const { userInfo } = useSelector(state => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!_.isEmpty(dataProp)) {
			handleAddEventClickToUrlTags();
			handleAddEventClickMentionTags();
			// handleAddEventClickToHashtagTags(); // không xóa
		}
	});

	useEffect(() => {
		if (isEditingComment) {
			const commentEditField = document.querySelector(`.comment-editor-last-${data.id}`);
			const editorChild = commentEditField.querySelector('.public-DraftEditor-content');

			const handlePressEsc = e => {
				if (document.activeElement === editorChild && e.key === 'Escape') {
					// Khi nhấn Esc thì hủy bỏ chỉnh sửa comment
					handleCancelEditing();
				}
			};
			document.addEventListener('keydown', handlePressEsc);
			return () => {
				document.removeEventListener('keydown', handlePressEsc);
			};
		}
	}, [isEditingComment]);

	const handleAddEventClickToUrlTags = useCallback(() => {
		const arr = document.querySelectorAll('.url-class');
		for (let i = 0; i < arr.length; i++) {
			const dataUrl = arr[i].getAttribute('data-url');
			arr[i].onclick = () => directUrl(dataUrl);
		}
	}, [dataProp]);

	const handleAddEventClickMentionTags = useCallback(() => {
		const arr = document.querySelectorAll('.mention-class');
		for (let i = 0; i < arr.length; i++) {
			const mentionUserId = arr[i].getAttribute('data-user-id');
			arr[i].onclick = () => navigate(`/profile/${mentionUserId}`);
		}
	}, [dataProp]);

	// không xóa
	// 	const handleAddEventClickToHashtagTags = useCallback(() => {
	// 		const arr = document.querySelectorAll('.hashtag-class');
	// 		for (let i = 0; i < arr.length; i++) {
	// 			const dataHashtagNavigate = arr[i].getAttribute('data-hashtag-navigate');
	// 			arr[i].onclick = () => handleClickHashtag(dataHashtagNavigate);
	// 		}
	// 	}, [dataProp]);
	//
	// 	const handleClickHashtag = dataHashtagNavigate => {
	// 		navigate(dataHashtagNavigate);
	// 	};

	const directUrl = url => {
		setModalShow(true);
		let urlFormated = '';
		if (url.includes('http')) {
			urlFormated = url;
		} else {
			urlFormated = `https://${url}`;
		}
		urlToDirect.current = urlFormated;
	};

	const handleAccept = () => {
		setModalShow(false);
		window.open(urlToDirect.current);
	};

	const handleCancel = () => {
		setModalShow(false);
		urlToDirect.current = '';
	};

	const handleLikeUnlikeCmt = async () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			const newCloneData = { ...data };
			if (isLiked) {
				newCloneData.like -= 1;
				setData(newCloneData);
			} else {
				newCloneData.like += 1;
				setData(newCloneData);
			}

			try {
				if (type === POST_TYPE) {
					await dispatch(likeAndUnlikeCommentPost(data.id)).unwrap();
				} else if (type === QUOTE_TYPE) {
					await dispatch(likeQuoteComment(data.id)).unwrap();
				} else if (type === REVIEW_TYPE) {
					await dispatch(likeAndUnlikeCommentReview(data.id)).unwrap();
				} else {
					await dispatch(likeAndUnlikeGroupComment(data.id)).unwrap();
				}
				setIsLiked(!isLiked);
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	const generateContent = content => {
		// if (content.match(urlRegex) || content.match(hashtagRegex)) { // k xóa
		if (content.match(urlRegex)) {
			const newContent = content.replace(urlRegex, data => {
				return `<a class="url-class" data-url=${data}>${
					data.length <= 50 ? data : data.slice(0, 50) + '...'
				}</a>`;
			});

			// không xóa
			// .replace(hashtagRegex, data => {
			// 	const newData = data
			// 		.normalize('NFD')
			// 		.replace(/[\u0300-\u036f]/g, '')
			// 		.replace(/đ/g, 'd')
			// 		.replace(/Đ/g, 'D');
			// 	if (postData.groupId) {
			// 		return `<a class="hashtag-class" data-hashtag-navigate="/hashtag-group/${
			// 			postData.groupId
			// 		}/${newData.slice(1)}">${newData}</a>`;
			// 	} else {
			// 		return `<a class="hashtag-class" data-hashtag-navigate="/hashtag/${newData.slice(
			// 			1
			// 		)}">${newData}</a>`;
			// 	}
			// });
			return newContent;
		} else {
			return content;
		}
	};

	useEffect(() => {
		setData(dataProp);
	}, [dataProp]);

	useEffect(() => {
		if (type === QUOTE_TYPE) {
			if (data.createdBy === postData.createdBy) {
				setIsAuthor(true);
			}
		} else {
			if (data.createdBy === postData.actor) {
				setIsAuthor(true);
			}
		}
		setIsLiked(data.isLike);
	}, [data]);

	const handleViewPostDetail = () => {
		if (!window.location.pathname.includes('/detail-feed/')) {
			if (postData.minipostId) {
				navigate(`/detail-feed/mini-post/${postData.minipostId}`);
			} else if (postData.groupPostId) {
				navigate(`/detail-feed/group-post/${postData.groupPostId}`);
			} else if (postData.groupId) {
				navigate(`/detail-feed/group-post/${postData.id}`);
			} else {
				navigate(`/detail-feed/mini-post/${postData.id}`);
			}
		}
	};

	const onClickEditComment = () => {
		setIsEditingComment(true);
	};

	const handleCancelEditing = () => {
		setIsEditingComment(false);
	};

	const handleEditComment = async (content, replyId) => {
		if (content) {
			const params = {
				id: data.id,
				body: {
					content: content,
				},
			};
			try {
				if (type === 'post') {
					await dispatch(updateCommentMinipost(params)).unwrap();
				} else if (type === 'group') {
					await dispatch(updateCommentGroupPost(params)).unwrap();
				} else if (type === 'review') {
					await dispatch(updateCommentReview(params)).unwrap();
				} else if (type === 'quote') {
					await dispatch(updateCommentQuote(params)).unwrap();
				}
			} catch (err) {
				NotificationError(err);
			} finally {
				// Xử lí hiển thị
				dispatch(
					setParamHandleEdit({
						id: data.id,
						content: content,
						replyId: replyId,
						type: type,
					})
				);
				handleCancelEditing();
			}
		}
	};

	return (
		<div className='comment'>
			<UserAvatar
				className='comment__avatar'
				size='sm'
				source={data.user?.avatarImage}
				handleClick={() => navigate(`/profile/${data.createdBy}`)}
			/>
			{isEditingComment ? (
				<div className='comment__editing'>
					<CommentEditor
						hideAvatar
						className={`comment-editor-last-${data.id}`}
						commentLv1Id={data.replyId}
						onCreateComment={handleEditComment}
						initialContent={dataProp.content}
					/>

					<div className='comment__editing__cancel'>
						Nhấn Esc để <span onClick={handleCancelEditing}>hủy bỏ</span>
					</div>
				</div>
			) : (
				<div className='comment__wrapper'>
					<div className='comment__wrapper__info'>
						<div className='comment__container'>
							<div className='comment__header'>
								<Link to={`/profile/${data.user?.id}`}>
									<span className='comment__author'>
										{data.user?.fullName ||
											data.user?.lastName ||
											data.user?.firstName ||
											'Không xác định'}
									</span>
								</Link>

								{isAuthor && (
									<Badge className='comment__badge' bg='primary-light'>
										Tác giả
									</Badge>
								)}
							</div>
							{data?.content && (
								<p
									className='comment__content'
									dangerouslySetInnerHTML={{
										__html: generateContent(data.content),
									}}
								></p>
							)}
							{data.like !== 0 ? (
								<div className='cmt-like-number'>
									<LikeComment />

									{data.like}
								</div>
							) : null}
						</div>
						{[data.user?.id, data.createdBy].includes(userInfo.id) && (
							<div
								className={`comment__wrapper__info__options ${showOptionsComment && 'isShowing'}`}
								onClick={() => setShowOptionsComment(!showOptionsComment)}
							>
								<div className='comment__wrapper__info__options__elipsis'>...</div>
								{showOptionsComment && (
									<div className='comment__wrapper__info__options__list' ref={optionsCommentList}>
										<p onClick={onClickEditComment}>Sửa bình luận</p>
										<p>Xóa</p>
									</div>
								)}
							</div>
						)}
					</div>

					<ul className='comment__action'>
						<li
							className={classNames('comment__item', {
								'liked': isLiked,
							})}
							onClick={() => handleLikeUnlikeCmt()}
						>
							Thích
						</li>
						<li
							className='comment__item'
							onClick={() =>
								handleReply(commentLv1Id, {
									id: data.user.id,
									name: data.user.fullName || data.user.firstName + ' ' + data.user.lastName,
									avatar: data.user.avatarImage,
								})
							}
						>
							Phản hồi
						</li>
						<li className='comment__item--timeline'>
							<div className='show-time'>
								<span onClick={handleViewPostDetail}>{`${calculateDurationTime(data.createdAt)}`}</span>
								<ShowTime dataTime={data.createdAt} />
							</div>
						</li>
					</ul>
				</div>
			)}

			<DirectLinkALertModal modalShow={modalShow} handleAccept={handleAccept} handleCancel={handleCancel} />
		</div>
	);
};

Comment.defaultProps = {
	dataProp: {},
	handleReply: () => {},
	postData: {},
	commentLv1Id: null,
	type: POST_TYPE,
	handleUpdateCommentsListAfterEditing: () => {},
};

Comment.propTypes = {
	dataProp: PropTypes.object,
	postData: PropTypes.object,
	handleReply: PropTypes.func,
	commentLv1Id: PropTypes.number,
	type: PropTypes.string,
	handleUpdateCommentsListAfterEditing: PropTypes.func,
};

export default Comment;
