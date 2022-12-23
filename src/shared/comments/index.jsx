import classNames from 'classnames';
import { LikeComment } from 'components/svg';
import { POST_TYPE, QUOTE_TYPE, REVIEW_TYPE, urlRegex } from 'constants/index';
import { calculateDurationTime } from 'helpers/Common';
import { NotificationError } from 'helpers/Error';
import Storage from 'helpers/Storage';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { likeAndUnlikeCommentPost } from 'reducers/redux-utils/activity';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { likeAndUnlikeCommentReview } from 'reducers/redux-utils/book';
import {
	deleteCommentGroupPost,
	deleteCommentMinipost,
	deleteCommentQuote,
	deleteCommentReview,
	setParamHandleEdit,
	updateCommentGroupPost,
	updateCommentMinipost,
	updateCommentQuote,
	updateCommentReview,
} from 'reducers/redux-utils/comment';
import { likeAndUnlikeGroupComment } from 'reducers/redux-utils/group';
import { likeQuoteComment } from 'reducers/redux-utils/quote';
import CommentEditor from 'shared/comment-editor';
import DirectLinkALertModal from 'shared/direct-link-alert-modal';
import ShowTime from 'shared/showTimeOfPostWhenHover/showTime';
import UserAvatar from 'shared/user-avatar';
import './comment.scss';

const Comment = ({ dataProp, handleReply, postData, commentLv1Id, type }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isAuthor, setIsAuthor] = useState(false);
	const [data, setData] = useState(dataProp);
	const [showOptionsComment, setShowOptionsComment] = useState(false);
	const [modalDirectShow, setModalDirectShow] = useState(false);
	const [modalDeleteShow, setModalDeleteShow] = useState(false);
	const [isEditingComment, setIsEditingComment] = useState(false);
	const [isFetchingLikeUnLike, setIsFetchingLikeUnLike] = useState(false);

	const urlToDirect = useRef('');
	const initialContent = useRef('');
	const optionsCommentPopup = useRef(null);

	const { userInfo } = useSelector(state => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!_.isEmpty(dataProp)) {
			handleAddEventClickToUrlTags();
			handleAddEventClickMentionTags();
			// handleAddEventClickToHashtagTags(); // không xóa
		}
	}, []);

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

	useEffect(() => {
		const handleClickOutside = e => {
			if (optionsCommentPopup.current && !optionsCommentPopup.current.contains(e.target)) {
				setShowOptionsComment(false);
			}
		};

		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

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
		setModalDirectShow(true);
		let urlFormated = '';
		if (url.includes('http')) {
			urlFormated = url;
		} else {
			urlFormated = `https://${url}`;
		}
		urlToDirect.current = urlFormated;
	};

	const handleAcceptDirect = () => {
		setModalDirectShow(false);
		window.open(urlToDirect.current);
	};

	const handleCancelDirect = () => {
		setModalDirectShow(false);
		urlToDirect.current = '';
	};

	const handleLikeUnlikeCmt = async () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else if (!isFetchingLikeUnLike) {
			setIsFetchingLikeUnLike(true);
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
			} finally {
				setIsFetchingLikeUnLike(false);
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

	const handleEditComment = async (content, replyId) => {
		if (content) {
			const params = {
				id: data.id,
				body: {
					content: content,
				},
			};
			initialContent.current = dataProp.content;
			try {
				dispatch(
					setParamHandleEdit({
						id: data.id,
						content: content,
						replyId: replyId,
						type: type,
					})
				);
				handleCancelEditing();

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
				dispatch(
					setParamHandleEdit({
						id: data.id,
						content: initialContent.current,
						replyId: replyId,
						type: type,
					})
				);
			}
		}
	};

	const handleCancelEditing = () => {
		setIsEditingComment(false);
		setShowOptionsComment(false);
	};

	const handleAcceptDelete = async () => {
		setModalDeleteShow(false);
		try {
			if (type === 'post') {
				await dispatch(deleteCommentMinipost(data.id)).unwrap();
			} else if (type === 'group') {
				await dispatch(deleteCommentGroupPost(data.id)).unwrap();
			} else if (type === 'review') {
				await dispatch(deleteCommentReview(data.id)).unwrap();
			} else if (type === 'quote') {
				await dispatch(deleteCommentQuote(data.id)).unwrap();
			}
			dispatch(
				setParamHandleEdit({
					id: data.id,
					content: null,
					replyId: data.replyId,
					type: type,
				})
			);
		} catch (err) {
			NotificationError(err);
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
								ref={optionsCommentPopup}
								className={`comment__wrapper__info__options ${showOptionsComment && 'isShowing'}`}
							>
								<div
									className='comment__wrapper__info__options__elipsis'
									onClick={() => setShowOptionsComment(!showOptionsComment)}
								>
									...
								</div>
								{showOptionsComment && (
									<div className='comment__wrapper__info__options__list'>
										<p onClick={() => setIsEditingComment(true)}>Sửa bình luận</p>
										<p onClick={() => setModalDeleteShow(true)}>Xóa</p>
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
							style={{ cursor: isFetchingLikeUnLike ? 'progress' : 'pointer' }}
							onClick={handleLikeUnlikeCmt}
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

			<DirectLinkALertModal
				modalShow={modalDirectShow}
				handleAccept={handleAcceptDirect}
				handleCancel={handleCancelDirect}
			/>
			<DirectLinkALertModal
				modalShow={modalDeleteShow}
				handleAccept={handleAcceptDelete}
				handleCancel={() => setModalDeleteShow(false)}
				message='Bạn có chắc chắn muốn xóa bình luận này không?'
				yesBtnMsg='Xóa'
				noBtnMsg='Không'
			/>
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
