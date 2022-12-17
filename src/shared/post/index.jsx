import classNames from 'classnames';
import { Feather } from 'components/svg';
import { calculateDurationTime } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateReactionActivity, updateReactionActivityGroup } from 'reducers/redux-utils/activity';
import { createComment, createCommentGroup } from 'reducers/redux-utils/comment';
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
import Comment from 'shared/comments';
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
	BASE_URL,
} from 'constants';
import { IconRanks } from 'components/svg';
import AuthorBook from 'shared/author-book';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import ShareUsers from 'pages/home/components/newfeed/components/modal-share-users';
import ShareTarget from 'shared/share-target';
import { handleMentionCommentId, handleCheckIfMentionFromGroup } from 'reducers/redux-utils/notification';
import { getMiniPostComments, getGroupPostComments } from 'reducers/redux-utils/post';
import vector from 'assets/images/Vector.png';
import SeeMoreComments from 'shared/see-more-comments/SeeMoreComments';
import { toast } from 'react-toastify';
import DirectLinkALertModal from 'shared/direct-link-alert-modal';
import ShowTime from 'shared/showTimeOfPostWhenHover/showTime';
import WithFriends from './withFriends/WithFriends';

const verbShareArray = [
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	MY_BOOK_VERB_SHARE,
	REVIEW_VERB_SHARE,
];

function Post({ postInformations, type, reduxMentionCommentId, reduxCheckIfMentionCmtFromGroup, isInDetail }) {
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

	const { userInfo } = useSelector(state => state.auth);
	const isJoinedGroup = useSelector(state => state.group.isJoinedGroup);

	const clickReply = useRef(null);
	const doneGetPostData = useRef(false);
	const isLikeTemp = useRef(postInformations.isLike);
	const urlToDirect = useRef('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!_.isEmpty(postInformations)) {
			handleAddEventClickToUrlTags();
			handleAddEventClickToHashtagTags();
		}
	});

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

		if (urlFormated.includes(BASE_URL)) {
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
				toast.warning('Bạn chưa tham gia nhóm');
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
		const arr = [];
		if (userData.id !== userInfo.id) {
			arr.push(userData);
		}
		setMentionUsersArr(arr);
		setReplyingCommentId(cmtLv1Id);
		clickReply.current = !clickReply.current;
	};

	const handleTime = () => {
		if (!_.isEmpty(postData.originId)) {
			switch (postData.originId.by) {
				case 'week':
					return 'tuần';
				case 'month':
					return 'tháng';
				case 'year':
					return 'năm';
			}
		}
	};

	const generateContent = content => {
		if (content.match(urlRegex) || content.match(hashtagRegex)) {
			const newContent = content
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
			return newContent;
		} else {
			return content;
		}
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
	}, [postData]);

	const handleAccept = () => {
		setModalShow(false);
		window.open(urlToDirect.current);
	};

	const handleCancel = () => {
		setModalShow(false);
		urlToDirect.current = '';
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

	const handleTimeChart = () => {
		switch (postData?.metaData?.chartType) {
			case 'week':
				return 'tuần';
			case 'month':
				return 'tháng';
			case 'year':
				return 'năm';
			default:
				break;
		}
	};

	const renderChartTitle = () => {
		if (postData?.metaData?.type === 'readingChart') {
			return `# Số ${
				postData?.metaData?.isReadedChart ? 'sách' : 'trang sách'
			} đã đọc nhiều nhất theo ${handleTimeChart()}`;
		} else if (postData?.metaData?.type === 'growthChart') {
			return `# Biểu đồ tăng trưởng của cuốn sách "${postData?.metaData?.book?.name}" của...`;
		}
	};

	return (
		<div className='post__container'>
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
						<img src={vector} />
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
			{(postData?.metaData?.type === 'readingChart' || postData?.metaData?.type === 'growthChart') && (
				<div className='post__title__share__rank'>
					<span className='number__title__rank'>{renderChartTitle()}</span>
				</div>
			)}
			{(postData.message || postData.content) && (
				<div className='post__content-wrapper'>
					<div
						className={readMore ? 'post__content--readmore' : 'post__content'}
						dangerouslySetInnerHTML={{
							__html: generateContent(postData.message || postData.content),
						}}
					></div>
					{(postData?.message?.length > 500 || postData.content?.length > 500) &&
						_.isEmpty(postData.preview) && (
							<div className='read-more-post' onClick={() => setReadMore(!readMore)}>
								{readMore ? 'Rút gọn' : 'Xem thêm'}
							</div>
						)}
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
							key={item.id}
							className={classNames('badge bg-primary-light')}
							onClick={() => navigate(`/category/detail/${item.categoryId}`)}
						>
							<span>{item.category.name}</span>
						</li>
					))}
				</ul>
			)}
			{!_.isEmpty(postData.originId) && postData.originId.type === 'topQuote' && (
				<div className='post__title__share__rank'>
					<span className='number__title__rank'># Top {postData.originId.rank} quotes </span>
					<span className='title__rank'>
						{postData.info.category
							? `  được like nhiều nhất thuộc ${postData.info.category.name} theo ${handleTime()} `
							: `  được like nhiều nhất theo ${handleTime()} `}
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
						} theo ${handleTime()} `}
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
					{postData.verb === POST_VERB_SHARE && <PostShare postData={postData} directUrl={directUrl} />}
					{postData.verb === QUOTE_VERB_SHARE && <QuoteCard data={postData.sharePost} isShare={true} />}
					{postData.verb === GROUP_POST_VERB_SHARE && <PostShare postData={postData} directUrl={directUrl} />}
					{(postData.verb === TOP_BOOK_VERB_SHARE || postData.verb === MY_BOOK_VERB_SHARE) && (
						<AuthorBook data={postData} inPost={true} />
					)}
					{postData.verb === TOP_QUOTE_VERB_SHARE && <QuoteCard data={postData.info} isShare={true} />}
					{postData.verb === REVIEW_VERB_SHARE && <PostShare postData={postData} directUrl={directUrl} />}
				</div>
			)}
			{postData.verb === TOP_USER_VERB_SHARE && <ShareUsers postData={postData} />}

			{postData.book && (
				<PostBook
					data={postData.book}
					bookProgress={postData.metaData?.progress || postData.book.progress || 0}
				/>
			)}
			{postData.verb === READ_TARGET_VERB_SHARE && <ShareTarget postData={postData} inPost={true} />}
			{postData?.image?.length > 0 && <GridImage images={postData.image} inPost={true} postId={postData.id} />}
			{(postData?.image?.length === 0 &&
				!_.isEmpty(postData.sharePost?.preview) &&
				_.isEmpty(postData.sharePost?.book)) ||
				(!_.isEmpty(postData.preview) && _.isEmpty(postData.book) && (
					<>
						{videoId ? (
							<iframe
								className='post__video-youtube'
								src={`//www.youtube.com/embed/${videoId}`}
								frameBorder={0}
								allowFullScreen={true}
							></iframe>
						) : (
							<PreviewLink isFetching={false} urlData={postData.preview} driectToUrl={directUrl} />
						)}
					</>
				))}
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
									{firstPlaceComment.map(comment => (
										<div key={comment.id}>
											<Comment
												commentLv1Id={comment.id}
												dataProp={comment}
												postData={postData}
												handleReply={handleReply}
												type={type}
											/>
											<div className='comment-reply-container'>
												{comment.reply && !!comment.reply?.length && (
													<>
														{showReplyArrayState.includes(comment.id) ? (
															<div className='reply-comment-item'>
																{comment.reply?.map(commentChild => (
																	<div key={commentChild.id}>
																		<Comment
																			commentLv1Id={comment.id}
																			dataProp={commentChild}
																			postData={postData}
																			handleReply={handleReply}
																			type={type}
																		/>
																	</div>
																))}
															</div>
														) : (
															<div
																className='reply-see-more'
																onClick={() => onClickSeeMoreReply(comment.id)}
															>
																Xem phản hồi
															</div>
														)}
													</>
												)}
												<CommentEditor
													onCreateComment={() => onCreateComment(comment.id)}
													className={classNames(
														`reply-comment-editor reply-comment-${comment.id}`,
														{
															'show': comment.id === replyingCommentId,
														}
													)}
													mentionUsersArr={mentionUsersArr}
													commentLv1Id={comment.id}
													replyingCommentId={replyingCommentId}
													clickReply={clickReply.current}
													setMentionUsersArr={setMentionUsersArr}
												/>
											</div>
										</div>
									))}
								</>
							)}
							{/* các bình luận ngoại trừ firstPlaceComment */}
							{postData.usersComments && postData.usersComments?.length > 0 && (
								<>
									{postData.usersComments
										.filter(x => x.id !== firstPlaceCommentId)
										.map(comment => (
											<div key={comment.id}>
												<Comment
													commentLv1Id={comment.id}
													dataProp={comment}
													postData={postData}
													handleReply={handleReply}
													type={type}
												/>

												<div className='comment-reply-container'>
													{comment.reply && !!comment.reply?.length && (
														<>
															{showReplyArrayState.includes(comment.id) ? (
																<div className='reply-comment-item'>
																	{comment.reply?.map(commentChild => (
																		<div key={commentChild.id}>
																			<Comment
																				commentLv1Id={comment.id}
																				dataProp={commentChild}
																				postData={postData}
																				handleReply={handleReply}
																				type={type}
																			/>
																		</div>
																	))}
																</div>
															) : (
																<div
																	className='reply-see-more'
																	onClick={() => onClickSeeMoreReply(comment.id)}
																>
																	Xem phản hồi
																</div>
															)}
														</>
													)}
													<CommentEditor
														onCreateComment={onCreateComment}
														className={classNames(
															`reply-comment-editor reply-comment-${comment.id}`,
															{
																'show': comment.id === replyingCommentId,
															}
														)}
														mentionUsersArr={mentionUsersArr}
														commentLv1Id={comment.id}
														replyingCommentId={replyingCommentId}
														clickReply={clickReply.current}
														setMentionUsersArr={setMentionUsersArr}
													/>
												</div>
											</div>
										))}
								</>
							)}
						</>
					) : (
						// còn khi ở ngoài: chỉ hiển thị 1 cái mới nhất
						<>
							{postData.usersComments && postData.usersComments?.length > 0 && (
								<>
									{postData.usersComments.map(
										(comment, index) =>
											index === postData.usersComments.length - 1 && (
												<div key={comment.id}>
													<Comment
														commentLv1Id={comment.id}
														dataProp={comment}
														postData={postData}
														handleReply={handleReply}
														type={type}
													/>
													<div className='comment-reply-container'>
														{comment.reply && !!comment.reply?.length && (
															<>
																{showReplyArrayState.includes(comment.id) ? (
																	<div className='reply-comment-item'>
																		{comment.reply.map(commentChild => (
																			<div key={commentChild.id}>
																				<Comment
																					commentLv1Id={comment.id}
																					dataProp={commentChild}
																					postData={postData}
																					handleReply={handleReply}
																					type={type}
																				/>
																			</div>
																		))}
																	</div>
																) : (
																	<div
																		className='reply-see-more'
																		onClick={() => onClickSeeMoreReply(comment.id)}
																	>
																		Xem phản hồi
																	</div>
																)}
															</>
														)}
														<CommentEditor
															onCreateComment={onCreateComment}
															className={classNames(
																`reply-comment-editor reply-comment-${comment.id}`,
																{
																	'show': comment.id === replyingCommentId,
																}
															)}
															mentionUsersArr={mentionUsersArr}
															commentLv1Id={comment.id}
															replyingCommentId={replyingCommentId}
															clickReply={clickReply.current}
															setMentionUsersArr={setMentionUsersArr}
														/>
													</div>
												</div>
											)
									)}
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
							{postData.usersComments.map(comment => (
								<div key={comment.id}>
									<Comment
										commentLv1Id={comment.id}
										dataProp={comment}
										postData={postData}
										handleReply={handleReply}
										type={type}
									/>
									<div className='comment-reply-container'>
										{comment.reply && !!comment.reply?.length && (
											<>
												{showReplyArrayState.includes(comment.id) ? (
													<>
														{comment.reply?.map(commentChild => (
															<div key={commentChild.id}>
																<Comment
																	commentLv1Id={comment.id}
																	dataProp={commentChild}
																	postData={postData}
																	handleReply={handleReply}
																	type={type}
																/>
															</div>
														))}
													</>
												) : (
													<div
														className='reply-see-more'
														onClick={() => onClickSeeMoreReply(comment.id)}
													>
														Xem phản hồi
													</div>
												)}
											</>
										)}
										<CommentEditor
											onCreateComment={onCreateComment}
											className={classNames(`reply-comment-editor reply-comment-${comment.id}`, {
												'show': comment.id === replyingCommentId,
											})}
											mentionUsersArr={mentionUsersArr}
											commentLv1Id={comment.id}
											replyingCommentId={replyingCommentId}
											clickReply={clickReply.current}
											setMentionUsersArr={setMentionUsersArr}
										/>
									</div>
								</div>
							))}
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
		</div>
	);
}

Post.defaultProps = {
	postInformations: {},
	type: POST_TYPE,
	reduxMentionCommentId: null,
	reduxCheckIfMentionCmtFromGroup: null,
	isInDetail: false,
};

Post.propTypes = {
	postInformations: PropTypes.any,
	type: PropTypes.string,
	reduxMentionCommentId: PropTypes.any,
	reduxCheckIfMentionCmtFromGroup: PropTypes.any,
	isInDetail: PropTypes.bool,
};

export default Post;
