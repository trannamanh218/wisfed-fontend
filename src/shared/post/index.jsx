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
import { Modal } from 'react-bootstrap';
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
} from 'constants';
import { IconRanks } from 'components/svg';
import AuthorBook from 'shared/author-book';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import ShareUsers from 'pages/home/components/newfeed/components/modal-share-users';
import ShareTarget from 'shared/share-target';
import { handleMentionCommentId, handleCheckIfMentionFromGroup } from 'reducers/redux-utils/notification';
import { getMiniPostComments, getGroupPostComments } from 'reducers/redux-utils/post';
import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';
import SeeMoreComments from 'shared/see-more-comments/SeeMoreComments';

const urlRegex =
	/(http(s)?:\/\/)?(www(\.))?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_\+.~#?&//=]*)([^"<\s]+)(?![^<>]*>|[^"]*?<\/a)/g;
const hashtagRegex =
	/#(?![0-9_]+\b)[0-9a-z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/gi;

const verbShareArray = [
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	MY_BOOK_VERB_SHARE,
	REVIEW_VERB_SHARE,
];

function Post({ postInformations, type, reduxMentionCommentId, reduxCheckIfMentionCmtFromGroup, isInDetail = false }) {
	const [postData, setPostData] = useState({});
	const [videoId, setVideoId] = useState('');
	const { userInfo } = useSelector(state => state.auth);
	const [replyingCommentId, setReplyingCommentId] = useState(-1);
	const [mentionUsersArr, setMentionUsersArr] = useState([]);

	const [mentionCommentId, setMentionCommentId] = useState(null);
	const [checkIfMentionCmtFromGroup, setCheckIfMentionCmtFromGroup] = useState(null);
	const [firstPlaceComment, setFirstPlaceComment] = useState([]);
	const [firstPlaceCommentId, setFirstPlaceCommentId] = useState(null);

	const [haveNotClickedSeeMoreOnce, setHaveNotClickedSeeMoreOnce] = useState(true);

	const [showModalOthers, setShowModalOthers] = useState(false);

	const handleCloseModalOthers = () => setShowModalOthers(false);
	const handleShowModalOthers = () => setShowModalOthers(true);

	const [showReplyArrayState, setShowReplyArrayState] = useState([]);
	const clickReply = useRef(null);
	const doneGetPostData = useRef(false);
	const isLikeTemp = useRef(postInformations.isLike);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onClickUserInModalOthers = paramItem => {
		handleCloseModalOthers();
		navigate(`/profile/${paramItem.userId}`);
	};

	useEffect(() => {
		if (!_.isEmpty(postInformations) && postInformations.usersComments?.length) {
			const commentsReverse = [...postInformations.usersComments];
			commentsReverse.reverse();
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

	const directUrl = url => {
		window.open(url);
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
				NotificationError(err);
			}
		}
	};

	const handleLikeAction = async () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			const setLike = !postData.isLike;
			const numberOfLike = setLike ? postData.like + 1 : postData.like - 1;
			setPostData(prev => ({ ...prev, isLike: !prev.isLike, like: numberOfLike }));
			handleCallLikeUnlikeApi(setLike);
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

	const withFriends = paramInfo => {
		if (paramInfo.length === 1) {
			return (
				<span>
					{' cùng với '}
					<Link to={`/profile/${paramInfo[0].userId}`}>
						{paramInfo[0].users.fullName ||
							paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					</Link>
					<span style={{ fontWeight: '500' }}>.</span>
				</span>
			);
		} else if (paramInfo.length === 2) {
			return (
				<span>
					{' cùng với '}
					<Link to={`/profile/${paramInfo[0].userId}`}>
						{paramInfo[0].users.fullName ||
							paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					</Link>
					{' và '}
					<Link to={`/profile/${paramInfo[1].userId}`}>
						{paramInfo[1].users.fullName ||
							paramInfo[1].users.firstName + ' ' + paramInfo[1].users.lastName}
					</Link>
					<span style={{ fontWeight: '500' }}>.</span>
				</span>
			);
		} else {
			return (
				<span>
					{' cùng với '}
					<Link to={`/profile/${paramInfo[0].users.id}`}>
						{paramInfo[0].users.fullName ||
							paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					</Link>
					{' và '}
					<span className='post__user__container__mention-users-plus' onClick={() => handleShowModalOthers()}>
						{paramInfo.length - 1} người khác.
						<div className='post__user__container__list-mention-users'>
							{!!paramInfo.length && (
								<>
									{paramInfo.slice(1).map((item, index) => (
										<div className='post__user__container__list-mention-users__name' key={index}>
											{item.users.fullName || item.users.firstName + ' ' + item.users.lastName}
										</div>
									))}
								</>
							)}
						</div>
					</span>
					<Modal show={showModalOthers} onHide={handleCloseModalOthers} className='modal-tagged-others'>
						<Modal.Header closeButton>
							<Modal.Title>Mọi người</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{!!paramInfo.length && (
								<>
									{paramInfo.slice(1).map((item, index) => (
										<div key={index} style={{ marginBottom: '1rem' }}>
											<img
												onClick={() => onClickUserInModalOthers(item)}
												className='modal-tagged-others__avatar'
												src={item.users.avatarImage || defaultAvatar}
												onError={e => e.target.setAttribute('src', defaultAvatar)}
											></img>
											<span
												onClick={() => onClickUserInModalOthers(item)}
												className='modal-tagged-others__name'
											>
												{item.users.fullName ||
													item.users.firstName + ' ' + item.users.lastName}
											</span>
										</div>
									))}
								</>
							)}
						</Modal.Body>
					</Modal>
				</span>
			);
		}
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
				.replace(
					urlRegex,
					data =>
						`<a class="url-class" href=${
							data.includes('https://') ? data : `https://${data}`
						} target="_blank">${data.length <= 50 ? data : data.slice(0, 50) + '...'}</a>`
				)
				.replace(hashtagRegex, data => {
					const newData = data
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.replace(/đ/g, 'd')
						.replace(/Đ/g, 'D');
					if (postInformations.groupId) {
						return `<a class="hashtag-class" href="/hashtag-group/${
							postInformations.groupId
						}/${newData.slice(1)}">${newData}</a>`;
					} else {
						return `<a class="hashtag-class" href="/hashtag/${newData.slice(1)}">${newData}</a>`;
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
					const reverseReplies = mentionedCommentAPI[0].reply.reverse();
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
					const reverseRepliesFather = fatherOfMentionedCommentAPI[0].reply.reverse();
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

	return (
		<div className='post__container'>
			<div className='post__user-status'>
				<UserAvatar
					data-testid='post__user-avatar'
					className='post__user-status__avatar'
					source={postData?.createdBy?.avatarImage || postData.user?.avatarImage}
					handleClick={() => navigate(`/profile/${postData.createdBy.id}`)}
				/>
				<div className='post__user-status__name-and-post-time-status'>
					<div data-testid='post__user-name' className='post__user-status__name'>
						<div className='post__user__container'>
							<Link
								to={`/profile/${postData.createdBy?.id || postData.user?.id}`}
								data-testid='post__user-name'
								className='post__user-status__name'
							>
								{postData?.createdBy?.fullName || postData?.user?.fullName || 'Ẩn danh'}
							</Link>

							{/* tagged people */}
							{postData.mentionsUsers &&
								!!postData.mentionsUsers.length &&
								withFriends(postData.mentionsUsers)}
							{postData.verb === GROUP_POST_VERB && (
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
							<span>{calculateDurationTime(postData.time || postData.createdAt)}</span>
							<>
								{postData.book && (
									<div className='post__user-status__subtitle'>
										{postData.isUpdateProgress && (
											<span style={{ marginRight: '12px' }}>Cập nhật tiến độ đọc sách</span>
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
			</div>
			{(postData.message || postData.content) && (
				<div
					className='post__description'
					dangerouslySetInnerHTML={{
						__html: generateContent(postData.message || postData.content),
					}}
				></div>
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
				<div className='creat-post-modal-content__main__share-container'>
					{postData.verb === POST_VERB_SHARE && <PostShare postData={postData} />}
					{postData.verb === QUOTE_VERB_SHARE && <QuoteCard data={postData.sharePost} isShare={true} />}
					{postData.verb === GROUP_POST_VERB_SHARE && <PostShare postData={postData} />}
					{(postData.verb === TOP_BOOK_VERB_SHARE || postData.verb === MY_BOOK_VERB_SHARE) && (
						<AuthorBook data={postData} inPost={true} />
					)}
					{postData.verb === TOP_QUOTE_VERB_SHARE && <QuoteCard data={postData.info} isShare={true} />}
					{postData.verb === REVIEW_VERB_SHARE && <PostShare postData={postData} />}
				</div>
			)}
			{postData.verb === TOP_USER_VERB_SHARE && <ShareUsers postData={postData} />}
			{postData.book && (
				<PostBook data={postData.book} bookProgress={postData.metaData?.progress || postData.book.progress} />
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
							<div onClick={() => directUrl(postData?.sharePost.url)}>
								<PreviewLink
									isFetching={false}
									urlData={postData.sharePost?.preview || postData.preview}
								/>
							</div>
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
												{comment.reply && !!comment.reply.length && (
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
																onClick={onClickSeeMoreReply}
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
													{comment.reply && !!comment.reply.length && (
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
										{comment.reply && !!comment.reply.length && (
											<>
												{showReplyArrayState.includes(comment.id) ? (
													<>
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
		</div>
	);
}

Post.defaultProps = {
	postInformations: {},
	type: POST_TYPE,
	reduxMentionCommentId: null,
	reduxCheckIfMentionCmtFromGroup: null,
};

Post.propTypes = {
	postInformations: PropTypes.any,
	type: PropTypes.string,
	reduxMentionCommentId: PropTypes.any,
	reduxCheckIfMentionCmtFromGroup: PropTypes.any,
	isInDetail: PropTypes.bool,
};

export default Post;
