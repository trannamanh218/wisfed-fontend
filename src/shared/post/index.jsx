import classNames from 'classnames';
import { Feather, Pencil, TrashIcon, CloseX, IconRanks } from 'components/svg';
import { calculateDurationTime } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateReactionActivity, updateReactionActivityGroup } from 'reducers/redux-utils/activity';
import { createComment, createCommentGroup, setDataDeleteCmt } from 'reducers/redux-utils/comment';
import { Modal, ModalBody } from 'react-bootstrap';
import CommentEditor from 'shared/comment-editor';
import GridImage from 'shared/grid-image';
import PostActionBar from 'shared/post-action-bar';
import PostBook from 'shared/post-book';
import UserAvatar from 'shared/user-avatar';
import './post.scss';
import PreviewLink from 'shared/preview-link/PreviewLink';
import { NotificationError } from 'helpers/Error';
import ReactRating from 'shared/react-rating';
import { Link, useNavigate } from 'react-router-dom';
import { createCommentReview } from 'reducers/redux-utils/book';
import QuoteCard from 'shared/quote-card';
import PostShare from 'shared/posts-Share';
import Play from 'assets/images/play.png';
import { likeAndUnlikeReview } from 'reducers/redux-utils/book';
import {
	POST_TYPE,
	REVIEW_TYPE,
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB,
	GROUP_POST_VERB_SHARE,
	READ_TARGET_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	TOP_USER_VERB_SHARE,
	MY_BOOK_VERB_SHARE,
	REVIEW_VERB_SHARE,
	urlRegex,
	hashtagRegex,
} from 'constants';
import AuthorBook from 'shared/author-book';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import ShareUsers from 'pages/home/components/newfeed/components/modal-share-users';
import ShareTarget from 'shared/share-target';
import { handleMentionCommentId, handleCheckIfMentionFromGroup } from 'reducers/redux-utils/notification';
import { getMiniPostComments, getGroupPostComments, deleteMiniPost } from 'reducers/redux-utils/post';
import SeeMoreComments from 'shared/see-more-comments/SeeMoreComments';
import { toast } from 'react-toastify';
import DirectLinkALertModal from 'shared/direct-link-alert-modal';
import ShowTime from 'shared/showTimeOfPostWhenHover/showTime';
import WithFriends from './withFriends/WithFriends';
import dots from 'assets/images/dots.png';
import { useVisible } from 'shared/hooks';
import CreatePostModalContent from 'pages/home/components/newfeed/components/create-post-modal-content';
import { useHookUpdateCommentsAfterDelete } from 'api/comment.hook';
import { blockAndAllowScroll } from 'api/blockAndAllowScroll.hook';
import { deleteMiniGroupPost } from 'reducers/redux-utils/group';
import RouteLink from 'helpers/RouteLink';
import PostNotAvailable from 'shared/post-not-available';
import { setting } from 'pages/home/components/newfeed/components/create-post-modal-content/settings';
import CommentsList from './CommentsList';

const verbShareArray = [
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	MY_BOOK_VERB_SHARE,
	REVIEW_VERB_SHARE,
];

function Post({
	postInformations,
	type,
	reduxMentionCommentId,
	reduxCheckIfMentionCmtFromGroup,
	isInDetail,
	handleUpdatePostArrWhenDeleted,
}) {
	const [postData, setPostData] = useState({});
	const [videoId, setVideoId] = useState('');
	const [replyingCommentId, setReplyingCommentId] = useState(-1);
	const [mentionUsersArr, setMentionUsersArr] = useState([]);
	const [readMore, setReadMore] = useState(false);
	const [mentionCommentId, setMentionCommentId] = useState(null);
	const [checkIfMentionCmtFromGroup, setCheckIfMentionCmtFromGroup] = useState(null);
	const [firstPlaceComment, setFirstPlaceComment] = useState([]);
	const [firstPlaceCommentId, setFirstPlaceCommentId] = useState(null);
	const [modalShow, setModalShow] = useState(false);
	const [haveNotClickedSeeMoreOnce, setHaveNotClickedSeeMoreOnce] = useState(true);
	const [showReplyArrayState, setShowReplyArrayState] = useState([]);
	const [showDeleteFeedModal, setShowDeleteFeedModal] = useState(false);
	const [showModalCreatePost, setShowModalCreatePost] = useState(false);
	const [isEditPost, setIsEditPost] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	const { ref: settingsRef, isVisible: isSettingsVisible, setIsVisible: setSettingsVisible } = useVisible(false);
	const { shareModeList } = setting;

	const { userInfo } = useSelector(state => state.auth);
	const isJoinedGroup = useSelector(state => state.group.isJoinedGroup);

	const clickReply = useRef(null);
	const doneGetPostData = useRef(false);
	const isLikeTemp = useRef(postInformations.isLike);
	const urlToDirect = useRef('');
	const postContentRef = useRef(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { dataDeleteCmt } = useSelector(state => state.comment);
	const { updateCommentsAfterDelete } = useHookUpdateCommentsAfterDelete(
		dataDeleteCmt,
		type,
		postData,
		setPostData,
		setDataDeleteCmt
	);

	blockAndAllowScroll(showModalCreatePost);

	useEffect(() => {
		if (!_.isEmpty(postInformations)) {
			handleAddEventClickToUrlTags();
			handleAddEventClickToHashtagTags();
		}
	});

	useEffect(() => {
		if (!_.isEmpty(postInformations) && postInformations.usersComments?.length) {
			const commentsReverse = [...postInformations.usersComments];
			commentsReverse.reverse();

			// Đảo ngược cả các comment reply nữa
			for (let i = 0; i < commentsReverse.length; i++) {
				if (commentsReverse[i].reply?.length > 0) {
					const commentsChildReverse = [...commentsReverse[i].reply];
					commentsChildReverse.reverse();

					const newCloneObj = { ...commentsReverse[i] };
					newCloneObj.reply = commentsChildReverse;

					commentsReverse[i] = newCloneObj;
				}
			}

			setPostData({ ...postInformations, usersComments: commentsReverse });
		} else {
			setPostData(postInformations);
		}
		if (!_.isEmpty(postInformations.preview) && postInformations.preview.url.includes('https://www.youtube.com/')) {
			const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			const match = postInformations.preview.url.match(regExp);
			if (match && match[2].length === 11) {
				setVideoId(match[2]);
			}
		}

		if (!_.isEmpty(postInformations)) {
			doneGetPostData.current = true;
		}
	}, [postInformations]);

	useEffect(() => {
		if (haveNotClickedSeeMoreOnce) {
			if (reduxMentionCommentId && mentionCommentId === null) {
				setMentionCommentId(reduxMentionCommentId);
			}
			if (reduxCheckIfMentionCmtFromGroup === 'group') {
				setCheckIfMentionCmtFromGroup(reduxCheckIfMentionCmtFromGroup);
			}
			if (!_.isEmpty(postData) && mentionCommentId) {
				// Nếu bấm xem bình luận nhắc đến bạn từ thông báo thì sẽ đưa bình luận đó lên đầu
				if (checkIfMentionCmtFromGroup === 'group') {
					handleChangeOrderMiniComments(getGroupPostComments);
				} else {
					handleChangeOrderMiniComments(getMiniPostComments);
				}
				// Sau đó xóa mentionCommentId trong redux
				dispatch(handleMentionCommentId(null));
				dispatch(handleCheckIfMentionFromGroup(null));
			}
		}

		if (postContentRef.current) {
			// check text clamped when use webkit-box
			const isTextClamped = elm => elm.scrollHeight > elm.clientHeight;
			if (isTextClamped(postContentRef.current)) {
				setHasMore(true);
			} else {
				setHasMore(false);
			}
		}
	}, [postData]);

	// Thay đổi lại danh sách comment sau khi đã xóa một comment
	useEffect(() => {
		updateCommentsAfterDelete();
	}, [dataDeleteCmt]);

	const handleAddEventClickToUrlTags = useCallback(() => {
		const arr = document.querySelectorAll('.url-class');
		for (let i = 0; i < arr.length; i++) {
			const dataUrl = arr[i].getAttribute('data-url');
			arr[i].onclick = () => directUrl(dataUrl);
		}
	}, [postInformations]);

	const handleAddEventClickToHashtagTags = useCallback(() => {
		const arr = document.querySelectorAll('.hashtag-class');
		for (let i = 0; i < arr.length; i++) {
			const dataHashtagNavigate = arr[i].getAttribute('data-hashtag-navigate');
			arr[i].onclick = () => handleClickHashtag(dataHashtagNavigate);
		}
	}, [postInformations]);

	const directUrl = url => {
		let urlFormated = '';
		if (url.includes('http')) {
			urlFormated = url;
		} else {
			urlFormated = `https://${url}`;
		}

		if (urlFormated.includes(location.href)) {
			const domain = new URL(urlFormated);
			navigate(domain.pathname);
		} else {
			setModalShow(true);
			urlToDirect.current = urlFormated;
		}
	};

	const handleClickHashtag = dataHashtagNavigate => {
		navigate(dataHashtagNavigate);
	};

	const onCreateComment = async (content, replyId) => {
		if (content) {
			const newArr = [];
			mentionUsersArr.forEach(item => newArr.push(item.id));
			try {
				let res = {};
				if (type === REVIEW_TYPE) {
					const commentReviewData = {
						reviewId: postData.id,
						replyId: replyId,
						content: content.replace(/&nbsp;/g, ''),
						mediaUrl: [],
						mentionsUser: newArr,
					};
					res = await dispatch(createCommentReview(commentReviewData)).unwrap();
				} else if (type === POST_TYPE) {
					const params = {
						minipostId: postData.minipostId || postData.id,
						content: content.replace(/&nbsp;/g, ''),
						mediaUrl: [],
						mentionsUser: newArr,
						replyId: replyId,
					};
					res = await dispatch(createComment(params)).unwrap();
				} else {
					const params = {
						groupPostId: postData.groupPostId || postData.id,
						content: content.replace(/&nbsp;/g, ''),
						mentionsUser: newArr,
						mediaUrl: [],
						replyId: replyId,
					};
					res = await dispatch(createCommentGroup(params)).unwrap();
				}
				if (!_.isEmpty(res)) {
					const newComment = { ...res, user: userInfo };
					const usersComments = [...postData.usersComments];
					if (res.replyId) {
						const cmtReplying = usersComments.filter(item => item.id === res.replyId);
						const reply = [...cmtReplying[0].reply];
						reply.push(newComment);
						const obj = { ...cmtReplying[0], reply };
						const index = usersComments.findIndex(item => item.id === res.replyId);
						usersComments[index] = obj;
					} else {
						newComment.reply = [];
						usersComments.push(newComment);
					}
					const newPostData = { ...postData, usersComments, comment: postData.comment + 1 };
					setPostData(newPostData);
				}
				onClickSeeMoreReply(replyId);
			} catch (err) {
				if (err.errorCode === 321 && location.pathname.includes('/group/')) {
					toast.warning('Bạn chưa tham gia nhóm');
				} else {
					NotificationError(err);
				}
			}
		}
	};

	const handleLikeAction = async () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			if (window.location.pathname.includes('/group/') && !isJoinedGroup) {
				toast.warning('Bạn chưa tham gia nhóm');
			} else {
				const setLike = !postData.isLike;
				const numberOfLike = setLike ? postData.like + 1 : postData.like - 1;
				setPostData(prev => ({ ...prev, isLike: !prev.isLike, like: numberOfLike }));
				handleCallLikeUnlikeApi(setLike);
			}
		}
	};

	const handleCallLikeUnlikeApi = useCallback(
		_.debounce(async isLike => {
			if (isLike !== isLikeTemp.current) {
				isLikeTemp.current = isLike;
				try {
					switch (type) {
						case POST_TYPE:
							await dispatch(updateReactionActivity(postData.minipostId || postData.id)).unwrap();
							break;
						case REVIEW_TYPE:
							await dispatch(likeAndUnlikeReview(postData.id)).unwrap();
							break;
						default:
							await dispatch(updateReactionActivityGroup(postData.groupPostId || postData.id)).unwrap();
							break;
					}
				} catch (err) {
					NotificationError(err);
				}
			}
		}, 1000),
		[doneGetPostData.current]
	);

	const handleReply = (cmtLv1Id, userData) => {
		onClickSeeMoreReply(cmtLv1Id);
		const arr = [];
		if (userData.id !== userInfo.id) {
			arr.push(userData);
		}
		setMentionUsersArr(arr);
		setReplyingCommentId(cmtLv1Id);
		clickReply.current = !clickReply.current;
	};

	const handleTime = item => {
		switch (item) {
			case 'week':
				return 'tuần';
			case 'month':
				return 'tháng';
			case 'year':
				return 'năm';
		}
	};

	const generateContent = content => {
		let newContent = content;
		if (content.match(urlRegex) || content.match(hashtagRegex)) {
			newContent = content
				.replace(urlRegex, data => {
					return `<a class="url-class" data-url=${data}>${
						data.length <= 50 ? data : data.slice(0, 50) + '...'
					}</a>`;
				})
				.replace(hashtagRegex, data => {
					const newData = data
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.replace(/đ/g, 'd')
						.replace(/Đ/g, 'D');
					if (postInformations.groupId) {
						return `<a class="hashtag-class" data-hashtag-navigate="/hashtag-group/${
							postInformations.groupId
						}/${newData.slice(1)}">${newData}</a>`;
					} else {
						return `<a class="hashtag-class" data-hashtag-navigate="/hashtag/${newData.slice(
							1
						)}">${newData}</a>`;
					}
				});
		}
		return newContent;
	};

	const handleChangeOrderMiniComments = async paramAPI => {
		try {
			// Gọi api lấy thông tin của bình luận nhắc đến bạn
			const params = { filter: JSON.stringify([{ operator: 'eq', value: mentionCommentId, property: 'id' }]) };
			const getMentionedCommentAPI = await dispatch(paramAPI({ postId: postData.id, params: params })).unwrap();
			const mentionedCommentAPI = getMentionedCommentAPI?.rows;
			if (!_.isEmpty(mentionedCommentAPI)) {
				if (mentionedCommentAPI[0].replyId === null) {
					// Đảo thứ tự replies
					const reverseReplies = mentionedCommentAPI[0].reply?.reverse();
					const obj = { ...mentionedCommentAPI[0], reply: reverseReplies };
					setFirstPlaceComment([obj]);
					setFirstPlaceCommentId(mentionCommentId);
				} else {
					const params2 = {
						filter: JSON.stringify([
							{ operator: 'eq', value: mentionedCommentAPI[0].replyId, property: 'id' },
						]),
					};
					// Gọi api lấy thông tin của bình luận cha của bình luận nhắc đến bạn
					const fatherOfMentionedCommentAPI = await dispatch(
						paramAPI({ postId: postData.id, params: params2 })
					).unwrap();
					// Đảo thứ tự replies
					const reverseRepliesFather = fatherOfMentionedCommentAPI[0].reply?.reverse();
					const objFather = { ...fatherOfMentionedCommentAPI[0], reply: reverseRepliesFather };
					setFirstPlaceComment([objFather]);
					setFirstPlaceCommentId(mentionedCommentAPI[0].replyId);
				}
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const onClickSeeMoreReply = paramId => {
		const arr = [...showReplyArrayState];
		arr.push(paramId);
		setShowReplyArrayState(arr);
	};

	const handleAccept = () => {
		setModalShow(false);
		window.open(urlToDirect.current);
	};

	const handleCancel = () => {
		setModalShow(false);
		urlToDirect.current = '';
	};

	const handleViewPostDetail = () => {
		const excludePaths = ['/detail-feed/', '/book/detail/', '/review/'];
		if (!excludePaths.some(path => window.location.pathname.includes(path))) {
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

	const renderChartTitle = () => {
		if (postData?.metaData?.type === 'readingChart') {
			return `# Biểu đồ số ${
				postData?.metaData?.isReadedChart ? 'sách' : 'trang sách'
			} đã đọc nhiều nhất theo ${handleTime(postData?.metaData.chartType)}`;
		} else if (postData?.metaData?.type === 'growthChart') {
			return `# Biểu đồ tăng trưởng của cuốn sách "${
				postData?.metaData?.book?.name
			}" của ${postData?.metaData?.book?.authors.map(name => name.authorName).join(', ')} `;
		}
	};

	const handleSettings = () => {
		setSettingsVisible(prev => !prev);
	};

	const handleDelete = () => {
		setSettingsVisible(prev => !prev);
		setShowDeleteFeedModal(true);
	};

	const closeDeleteFeedModal = () => {
		setShowDeleteFeedModal(false);
		setSettingsVisible(prev => prev);
	};

	const removeFeed = async () => {
		setShowDeleteFeedModal(false);
		try {
			const postId = postData.id;
			if (postData.groupId) {
				let feedId;
				const groupId = postData.groupInfo?.id ? postData.groupInfo?.id : postData.group?.id;
				if (
					window.location.pathname.includes('/group/') ||
					window.location.pathname.includes('/hashtag-group/') ||
					window.location.pathname.includes('/detail-feed/')
				) {
					feedId = postData?.getstreamId;
				} else {
					feedId = postData?.id;
				}
				const params = {
					groupId: groupId,
					feedId: feedId,
				};
				await dispatch(deleteMiniGroupPost(params)).unwrap();
			} else {
				const id = postData?.minipostId ? postData?.minipostId : postData?.id;
				await dispatch(deleteMiniPost(id)).unwrap();
			}
			handleUpdatePostArrWhenDeleted(postId);
			toast.success('Xoá bài viết thành công');
			if (window.location.pathname.includes('/detail-feed/')) {
				navigate(-1);
			}
		} catch (err) {
			const customId = 'custom-id-SettingMore-error';
			toast.error('Lỗi không xóa được bài viết', { toastId: customId });
		}
	};

	const handleOpenModal = () => {
		setSettingsVisible(prev => !prev);
		setShowModalCreatePost(true);
		setIsEditPost(true);
	};

	const handleUpdateMiniPost = data => {
		setPostData({ ...postData, ...data });
	};

	return (
		<div className='post__container'>
			<div className='box_post__user-status'>
				<div className='post__user-status'>
					<UserAvatar
						data-testid='post__user-avatar'
						className='post__user-status__avatar'
						source={postData?.createdBy?.avatarImage || postData.user?.avatarImage}
						handleClick={() => navigate(`/profile/${postData.createdBy?.id || postData.user?.id}`)}
					/>
					<div className='post__user-status__name-and-post-time-status'>
						<div className='post__user-status__name'>
							<Link
								to={`/profile/${postData.createdBy?.id || postData.user?.id}`}
								data-testid='post__user-name'
							>
								{postData?.createdBy?.fullName || postData?.user?.fullName || 'Ẩn danh'}
							</Link>

							{/* tagged people */}
							{postData.mentionsUsers && !!postData.mentionsUsers.length && (
								<WithFriends data={postData.mentionsUsers} />
							)}
							{(postData.verb === GROUP_POST_VERB ||
								window.location.pathname.includes('/hashtag-group/')) && (
								<>
									<img className='post__user-icon' src={Play} alt='arrow' />
									<Link
										to={`/group/${postData.group?.id || postData.groupInfo?.id}`}
										className='post__name__group'
									>
										{postData.group?.name || postData.groupInfo?.name}
									</Link>
								</>
							)}
						</div>
						<div className='post__user-status__post-time-status'>
							<div className='show-time'>
								<span onClick={handleViewPostDetail}>
									{calculateDurationTime(postData.time || postData.createdAt)}
								</span>
								{/* Hiển thị ngày giờ chính xác khi hover  */}
								<ShowTime dataTime={postData.time || postData.createdAt} />
							</div>
							{postData.isPrivate
								? shareModeList.find(item => item.value === 'private').icon
								: shareModeList.find(item => item.value === 'public').icon}
							<>
								{postData.book && (
									<div className='post__user-status__subtitle'>
										{postData.isUpdateProgress && (
											<span style={{ marginRight: '12px', marginLeft: '5px' }}>
												Cập nhật tiến độ đọc sách
											</span>
										)}
										{postInformations?.book?.actorRating !== null ? (
											<>
												<div className='post__user-status__post-time-status__online-dot'></div>
												<span>Xếp hạng</span>
												<ReactRating
													readonly={true}
													initialRating={
														postInformations?.book?.actorRating
															? postInformations?.book?.actorRating?.star
															: 0
													}
												/>
											</>
										) : null}
									</div>
								)}
							</>
						</div>
					</div>
				</div>
				{(postData.createdBy?.id === userInfo.id || postData.createdBy === userInfo.id) &&
					!window.location.pathname.includes('/book/detail/') && (
						<div ref={settingsRef} className='setting'>
							<button className='setting-mini-post-btn' onClick={handleSettings}>
								<img src={dots} alt='setting' />
							</button>
							{isSettingsVisible && (
								<ul className='setting-list'>
									<li className='setting-item' onClick={handleOpenModal}>
										<Pencil />
										<span className='setting-item__content'>Chỉnh sửa bài viết</span>
									</li>
									<li className='setting-item' onClick={handleDelete}>
										<TrashIcon />
										<span className='setting-item__content'>Xóa bài viết</span>
									</li>
								</ul>
							)}
						</div>
					)}
			</div>
			{(postData.message || postData.content) && (
				<div className='post__content-wrapper'>
					<div
						className={classNames('post__content', {
							'view-less': readMore === false,
						})}
						dangerouslySetInnerHTML={{
							__html: generateContent(postData.message || postData.content),
						}}
						ref={postContentRef}
					></div>
					{hasMore && (
						<div className='read-more-post' onClick={() => setReadMore(!readMore)}>
							{readMore ? 'Rút gọn' : 'Xem thêm'}
						</div>
					)}
				</div>
			)}
			{(postData?.metaData?.type === 'readingChart' || postData?.metaData?.type === 'growthChart') && (
				<div className='post__title__share__rank'>
					<span className='number__title__rank'>{renderChartTitle()}</span>
				</div>
			)}
			{!!postData?.mentionsAuthors?.length && (
				<ul className='tagged'>
					{postData.mentionsAuthors?.map(item => (
						<li
							key={item.id}
							className={classNames('badge bg-primary-light')}
							onClick={() => navigate(`/profile/${item.authorId}`)}
						>
							<Feather />
							<span>
								{item.authors.name ||
									item.authors.fullName ||
									item.authors.lastName ||
									item.authors.firstName ||
									'Không xác định'}
							</span>
						</li>
					))}
				</ul>
			)}
			{!!postData?.mentionsCategories?.length && (
				<ul className='tagged'>
					{postData.mentionsCategories?.map(item => (
						<li
							key={item.categoryId}
							className={classNames('badge bg-primary-light')}
							onClick={() => navigate(RouteLink.categoryDetail(item.categoryId, item.category.name))}
						>
							<span>{item?.category?.name}</span>
						</li>
					))}
				</ul>
			)}
			{!_.isEmpty(postData.originId) && postData.originId.type === 'topQuote' && (
				<div className='post__title__share__rank'>
					<span className='number__title__rank'># Top {postData.originId.rank} quotes </span>
					<span className='title__rank'>
						{postData.info.category
							? `  được like nhiều nhất thuộc ${postData.info.category.name} theo ${handleTime(
									postData?.originId?.by
							  )} `
							: `  được like nhiều nhất theo ${handleTime(postData?.originId?.by)} `}
					</span>
					<IconRanks />
				</div>
			)}
			{!_.isEmpty(postData.originId) && postData.originId.type === 'topBook' && (
				<div className='post__title__share__rank'>
					<span className='number__title__rank'># Top {postData.originId.rank} </span>
					<span className='title__rank'>
						{`  cuốn sách tốt nhất ${
							postData.info.category ? ` thuộc ${postData.info.category.name}` : ''
						} theo ${handleTime(postData?.originId?.by)} `}
					</span>
					<IconRanks />
				</div>
			)}
			{!_.isEmpty(postData.verb) && postData.verb === 'shareMyBook' && (
				<div className='post__title__share__rank'>
					<span className='number__title__rank'># Sách của tôi làm tác giả</span>
				</div>
			)}
			{verbShareArray.indexOf(postData.verb) !== -1 && (
				<div className='create-post-modal-content__main__share-container'>
					{postData.verb === POST_VERB_SHARE && (
						<>
							{postData.sharePost.isDeleted ? (
								<PostNotAvailable />
							) : (
								<PostShare postData={postData} directUrl={directUrl} />
							)}
						</>
					)}
					{postData.verb === QUOTE_VERB_SHARE && <QuoteCard data={postData.sharePost} isShare={true} />}
					{postData.verb === GROUP_POST_VERB_SHARE && (
						<>
							{postData.sharePost.isDeleted ? (
								<PostNotAvailable />
							) : (
								<PostShare postData={postData} directUrl={directUrl} />
							)}
						</>
					)}
					{(postData.verb === TOP_BOOK_VERB_SHARE || postData.verb === MY_BOOK_VERB_SHARE) && (
						<AuthorBook data={postData} inPost={true} />
					)}
					{postData.verb === TOP_QUOTE_VERB_SHARE && <QuoteCard data={postData.info} isShare={true} />}
					{postData.verb === REVIEW_VERB_SHARE && (
						<>
							{postData.sharePost.isDeleted ? (
								<PostNotAvailable />
							) : (
								<PostShare postData={postData} directUrl={directUrl} />
							)}
						</>
					)}
				</div>
			)}
			{postData.verb === TOP_USER_VERB_SHARE && <ShareUsers postData={postData} />}
			{postData?.image?.length > 0 && <GridImage images={postData.image} inPost={true} postId={postData.id} />}
			{!postData?.image?.length && !_.isEmpty(postData?.preview) && (
				<>
					{videoId ? (
						<iframe
							className='post__video-youtube'
							src={`//www.youtube.com/embed/${videoId}`}
							allowFullScreen={true}
						></iframe>
					) : (
						<PreviewLink isFetching={false} urlData={postData.preview} driectToUrl={directUrl} />
					)}
				</>
			)}
			{postData.book && (
				<PostBook
					data={postData.book}
					bookProgress={postData.book.progress || postData.metaData?.progress || 0}
				/>
			)}
			{postData.verb === READ_TARGET_VERB_SHARE && <ShareTarget postData={postData} inPost={true} />}
			<PostActionBar postData={postData} handleLikeAction={handleLikeAction} />

			<SeeMoreComments
				data={postData}
				setData={setPostData}
				haveNotClickedSeeMoreOnce={haveNotClickedSeeMoreOnce}
				setHaveNotClickedSeeMoreOnce={setHaveNotClickedSeeMoreOnce}
				isInDetail={isInDetail}
				postType={type}
			/>
			{/* Nếu chưa bấm xem thêm: */}
			{haveNotClickedSeeMoreOnce ? (
				<>
					{/* Nếu ở trong màn detail: hiển thị 10 bình luận*/}
					{isInDetail ? (
						<>
							{/* Comment mention đặt trên đầu  */}
							{firstPlaceComment && firstPlaceComment?.length > 0 && (
								<>
									<CommentsList
										data={firstPlaceComment}
										postData={postData}
										handleReply={handleReply}
										type={type}
										showReplyArrayState={showReplyArrayState}
										onClickSeeMoreReply={onClickSeeMoreReply}
										onCreateComment={onCreateComment}
										mentionUsersArr={mentionUsersArr}
										setMentionUsersArr={setMentionUsersArr}
										clickReply={clickReply}
										replyingCommentId={replyingCommentId}
									/>
								</>
							)}
							{/* các bình luận ngoại trừ firstPlaceComment */}
							{postData.usersComments && postData.usersComments?.length > 0 && (
								<>
									<CommentsList
										data={postData.usersComments.filter(x => x.id !== firstPlaceCommentId)}
										postData={postData}
										handleReply={handleReply}
										type={type}
										showReplyArrayState={showReplyArrayState}
										onClickSeeMoreReply={onClickSeeMoreReply}
										onCreateComment={onCreateComment}
										mentionUsersArr={mentionUsersArr}
										setMentionUsersArr={setMentionUsersArr}
										clickReply={clickReply}
										replyingCommentId={replyingCommentId}
									/>
								</>
							)}
						</>
					) : (
						// còn khi ở ngoài: chỉ hiển thị 1 cái mới nhất
						<>
							{postData.usersComments && postData.usersComments?.length > 0 && (
								<>
									<CommentsList
										data={[postData.usersComments.at(-1)]}
										postData={postData}
										handleReply={handleReply}
										type={type}
										showReplyArrayState={showReplyArrayState}
										onClickSeeMoreReply={onClickSeeMoreReply}
										onCreateComment={onCreateComment}
										mentionUsersArr={mentionUsersArr}
										setMentionUsersArr={setMentionUsersArr}
										clickReply={clickReply}
										replyingCommentId={replyingCommentId}
									/>
								</>
							)}
						</>
					)}
				</>
			) : (
				// Nếu đã bấm xem thêm thì hiển thị đầy đủ như bình thường
				<>
					{postData.usersComments && postData.usersComments?.length > 0 && (
						<>
							<CommentsList
								data={postData.usersComments}
								postData={postData}
								handleReply={handleReply}
								type={type}
								showReplyArrayState={showReplyArrayState}
								onClickSeeMoreReply={onClickSeeMoreReply}
								onCreateComment={onCreateComment}
								mentionUsersArr={mentionUsersArr}
								setMentionUsersArr={setMentionUsersArr}
								clickReply={clickReply}
								replyingCommentId={replyingCommentId}
							/>
						</>
					)}
				</>
			)}
			<CommentEditor
				className={`comment-editor-last-${postInformations.id}`}
				commentLv1Id={null}
				onCreateComment={onCreateComment}
				mentionUsersArr={mentionUsersArr}
				setMentionUsersArr={setMentionUsersArr}
			/>
			<DirectLinkALertModal modalShow={modalShow} handleAccept={handleAccept} handleCancel={handleCancel} />
			<Modal
				className='main-shelves__modal'
				show={showDeleteFeedModal}
				onHide={closeDeleteFeedModal}
				keyboard={false}
				centered
			>
				<span className='btn-closeX' onClick={closeDeleteFeedModal}>
					<CloseX />
				</span>
				<ModalBody>
					<h1 className='main-shelves__modal__title'>Bạn có muốn xóa bài viết này?</h1>
					<button className='btn main-shelves__modal__btn-delete btn-danger' onClick={removeFeed}>
						Xóa
					</button>
					<button className='btn-cancel' onClick={closeDeleteFeedModal}>
						Không
					</button>
				</ModalBody>
			</Modal>
			{showModalCreatePost && (
				<CreatePostModalContent
					dataEditMiniPost={postData}
					setShowModalCreatePost={setShowModalCreatePost}
					isEditPost={isEditPost}
					setIsEditPost={setIsEditPost}
					handleUpdateMiniPost={handleUpdateMiniPost}
				/>
			)}
		</div>
	);
}

Post.defaultProps = {
	postInformations: {},
	type: POST_TYPE,
	reduxMentionCommentId: null,
	reduxCheckIfMentionCmtFromGroup: null,
	isInDetail: false,
	handleUpdatePostArrWhenDeleted: () => {},
};

Post.propTypes = {
	postInformations: PropTypes.any,
	type: PropTypes.string,
	reduxMentionCommentId: PropTypes.any,
	reduxCheckIfMentionCmtFromGroup: PropTypes.any,
	isInDetail: PropTypes.bool,
	handleUpdatePostArrWhenDeleted: PropTypes.func,
};

export default Post;
