import classNames from 'classnames';
import { Feather } from 'components/svg';
import { calculateDurationTime } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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
import { useParams, useLocation, Link } from 'react-router-dom';
import { createCommentReview } from 'reducers/redux-utils/book';
import Comment from 'shared/comments';
import PostQuotes from 'shared/post-quotes';
import PostsShare from 'shared/posts-Share';
import Play from 'assets/images/play.png';
import { likeAndUnlikeReview } from 'reducers/redux-utils/book';
import { POST_TYPE, REVIEW_TYPE } from 'constants';
import { IconRanks } from 'components/svg';
import AuthorBook from 'shared/author-book';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import ShareUsers from 'pages/home/components/newfeed/components/modal-share-users';
import post from 'reducers/redux-utils/post';
import { useNavigate } from 'react-router-dom';

const urlRegex =
	/https?:\/\/www(\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

function Post({ postInformations, showModalCreatPost, inReviews = false }) {
	const [postData, setPostData] = useState({});
	const [videoId, setVideoId] = useState('');
	const { userInfo } = useSelector(state => state.auth);
	const [commentLv1IdArray, setCommentLv1IdArray] = useState([]);
	const [replyingCommentId, setReplyingCommentId] = useState(null);
	const [clickReply, setClickReply] = useState(false);
	const [mentionUsersArr, setMentionUsersArr] = useState([]);

	const { isSharePosts } = useSelector(state => state.post);
	const location = useLocation();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { bookId } = useParams();

	useEffect(() => {
		setPostData({ ...postInformations });
		if (!_.isEmpty(postInformations.preview) && postInformations.preview.url.includes('https://www.youtube.com/')) {
			const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			const match = postInformations.preview.url.match(regExp);
			if (match && match[2].length === 11) {
				setVideoId(match[2]);
			}
		}
	}, [postInformations]);

	const directUrl = url => {
		window.open(url);
	};

	useEffect(() => {
		if (postData.usersComments?.length > 0) {
			const commentLv1IdTemp = [];
			for (let i = 0; i < postData.usersComments.length; i++) {
				if (
					postData.usersComments[i].replyId === null &&
					!commentLv1IdTemp.includes(postData.usersComments[i].id)
				) {
					commentLv1IdTemp.push(postData.usersComments[i].id);
				}
			}
			setCommentLv1IdArray(commentLv1IdTemp);
		}
	}, [postData.usersComments]);

	// useEffect(() => {
	// 	const urlAddedArray = document.querySelectorAll('.url-color');
	// 	if (urlAddedArray.length > 0) {
	// 		for (let i = 0; i < urlAddedArray.length; i++) {
	// 			urlAddedArray[i].addEventListener('click', () => {
	// 				directUrl(urlAddedArray[i].innerText);
	// 			});
	// 		}
	// 	}
	// }, [postData]);

	const onCreateComment = async (content, replyId) => {
		const newArr = [];
		mentionUsersArr.forEach(item => newArr.push(item.userId));
		try {
			let res = {};
			if (bookId) {
				const commentReviewData = {
					reviewId: postData.id,
					replyId: replyId,
					content: content,
					mediaUrl: [],
					mentionsUser: newArr,
				};
				res = await dispatch(createCommentReview(commentReviewData)).unwrap();
			} else {
				if (location.pathname.includes('group')) {
					const params = {
						groupPostId: postData.minipostId || postData.id,
						content: content,
						mentionsUser: newArr,
						mediaUrl: [],
						replyId: replyId,
					};
					res = await dispatch(createCommentGroup(params)).unwrap();
				} else {
					const params = {
						minipostId: postData.minipostId || postData.groupPostId || postData.id,
						content: content,
						mediaUrl: [],
						mentionsUser: newArr,
						replyId: replyId,
					};
					res = await dispatch(createComment(params)).unwrap();
				}
			}
			if (!_.isEmpty(res)) {
				const newComment = { ...res, user: userInfo };
				const usersComments = [...postData.usersComments, newComment];
				const newPostData = { ...postData, usersComments, comment: postData.comment + 1 }; // Tự động cập nhật đếm comment
				setPostData(newPostData);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleLikeAction = async () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			try {
				if (location.pathname.includes('group')) {
					await dispatch(updateReactionActivityGroup(postData.id)).unwrap();
				} else if (inReviews) {
					await dispatch(likeAndUnlikeReview(postData.id)).unwrap();
				} else {
					await dispatch(updateReactionActivity(postData.minipostId || postData.id)).unwrap();
				}

				const setLike = !postData.isLike;
				const numberOfLike = setLike ? postData.like + 1 : postData.like - 1;
				setPostData(prev => ({ ...prev, isLike: !prev.isLike, like: numberOfLike }));
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	useEffect(() => {
		const textareaInCommentEdit = document.querySelector(`#textarea-${replyingCommentId}`);
		if (textareaInCommentEdit) {
			textareaInCommentEdit.focus();
			window.scroll({
				top: textareaInCommentEdit.offsetTop - 400,
				behavior: 'smooth',
			});
		}
	}, [replyingCommentId, clickReply]);

	const handleReply = (cmtLv1Id, userData) => {
		const arr = [];
		arr.push(userData);
		setMentionUsersArr(arr);
		setReplyingCommentId(cmtLv1Id);
		setClickReply(true);
		setTimeout(() => {
			setClickReply(false);
		}, 200);
	};

	const withFriends = paramInfo => {
		if (paramInfo.length === 1) {
			return (
				<span>
					{' cùng với '}
					{paramInfo[0].users.fullName || paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					{'.'}
				</span>
			);
		} else if (paramInfo.length === 2) {
			return (
				<span>
					{' cùng với '}
					{paramInfo[0].users.fullName || paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					{' và '}
					{paramInfo[1].users.fullName || paramInfo[1].users.firstName + ' ' + paramInfo[1].users.lastName}
					{'.'}
				</span>
			);
		} else {
			return (
				<span>
					{' cùng với '}
					{paramInfo[0].users.fullName || paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					{' và '}
					{paramInfo.length - 1}
					{' người khác.'}
				</span>
			);
		}
	};

	const infoUser = () => {
		return (
			<>
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
								{postData.mentionsUsers && postData.mentionsUsers.length !== 0 ? (
									withFriends(postData.mentionsUsers)
								) : (
									<span></span>
								)}
								{(postData.groupInfo || postData.group) && (
									<img className='post__user-icon' src={Play} alt='' />
								)}

								<Link
									to={`/group/${postData.groupInfo?.id || postData.group?.id}`}
									className='post__name__group'
								>
									{postData.groupInfo ? postData.groupInfo?.name : postData.group?.name}
								</Link>
							</div>

							<div className='post__user-status__post-time-status'>
								<span>{calculateDurationTime(postData.time || postData.createdAt)}</span>
								<>
									{postData.book && (
										<div className='post__user-status__subtitle'>
											<span>Cập nhật tiến độ đọc sách</span>
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
							__html: createSpanElements(postData.message || postData.content),
						}}
					></div>
				)}
			</>
		);
	};

	const renderInfo = () => {
		if (showModalCreatPost) {
			if (postData.sharePost) {
				return;
			} else {
				return infoUser();
			}
		} else {
			return infoUser();
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
				default:
					break;
			}
		}
	};

	const createSpanElements = data => {
		if (data.match(urlRegex)) {
			const subStringArray = data.split(' ');
			for (let i = 0; i < subStringArray.length; i++) {
				if (subStringArray[i].match(urlRegex)) {
					subStringArray[
						i
					] = `<span class="url-color"><a href=${subStringArray[i]} target="_blank">${subStringArray[i]}</a></span>`;
				} else {
					subStringArray[i] = `<span>${subStringArray[i]}</span>`;
				}
			}
			return subStringArray.join(' ');
		} else {
			return data;
		}
	};

	return (
		<div
			className={classNames('post__container', {
				'post__custom':
					isSharePosts && (postData.verb === 'shareQuote' || postData.verb === 'shareTopUserRanking'),
			})}
		>
			{(postData.verb === 'shareTopQuoteRanking' ||
				postData.verb === 'shareTopBookRanking' ||
				postData.verb === 'shareTopUserRanking') &&
			isSharePosts
				? ''
				: renderInfo()}

			{!!postData?.mentionsAuthors?.length && (
				<ul className='tagged'>
					{postData.mentionsAuthors?.map(item => (
						<li key={item.id} className={classNames('badge bg-primary-light')}>
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
						<li key={item.id} className={classNames('badge bg-primary-light')}>
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
						{postData.info.category
							? `  cuốn sách tốt nhất ${(
									<p style={{ textDecoration: 'underline' }}>{}</p>
							  )} theo ${handleTime()} `
							: `   cuốn sách tốt nhất theo ${handleTime()} `}
					</span>
					<IconRanks />
				</div>
			)}
			{postData.isShare && postData.verb === 'shareQuote' && <PostQuotes postsData={postData} />}
			{postData.verb === 'shareTopQuoteRanking' && <PostQuotes postsData={postData} />}
			{postData.verb === 'shareTopBookRanking' && <AuthorBook data={postData} />}
			{postData.verb === 'shareTopUserRanking' && <ShareUsers postsData={postData} />}
			{postData.book && (
				<PostBook
					data={{ ...postData.book, bookLibrary: postData.bookLibrary, actorCreatedPost: postData.actor }}
				/>
			)}

			{postData.verb === 'sharePost' && !_.isEmpty(postData.sharePost) && <PostsShare postData={postData} />}
			{postData.verb === 'shareGroupPost' && !_.isEmpty(postData.sharePost) && <PostsShare postData={postData} />}
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
			{!isSharePosts && (
				<>
					<PostActionBar postData={postData} handleLikeAction={handleLikeAction} />
					{postData.usersComments?.map(comment => {
						if (comment.replyId === null) {
							return (
								<div key={comment.id}>
									<Comment
										commentLv1Id={comment.id}
										data={comment}
										postData={postData}
										handleReply={handleReply}
										type={inReviews ? REVIEW_TYPE : POST_TYPE}
									/>

									<div className='comment-reply-container'>
										{postData.usersComments.map(commentChild => {
											if (commentChild.replyId === comment.id) {
												return (
													<div key={commentChild.id}>
														<Comment
															commentLv1Id={comment.id}
															data={commentChild}
															postData={postData}
															handleReply={handleReply}
															type={inReviews ? REVIEW_TYPE : POST_TYPE}
														/>
													</div>
												);
											}
										})}
										{commentLv1IdArray.includes(comment.id) && (
											<CommentEditor
												onCreateComment={onCreateComment}
												className={classNames('reply-comment-editor', {
													'show': comment.id === replyingCommentId,
												})}
												mentionUsersArr={mentionUsersArr}
												replyingCommentId={replyingCommentId}
												clickReply={clickReply}
												setMentionUsersArr={setMentionUsersArr}
											/>
										)}
									</div>
								</div>
							);
						}
					})}
					<CommentEditor
						replyingCommentId={null}
						onCreateComment={onCreateComment}
						mentionUsersArr={mentionUsersArr}
						setMentionUsersArr={setMentionUsersArr}
					/>
				</>
			)}
		</div>
	);
}

Post.propTypes = {
	postInformations: PropTypes.object,
	likeAction: PropTypes.func,
	className: PropTypes.string,
	showModalCreatPost: PropTypes.bool,
	inReviews: PropTypes.bool,
};

export default Post;
