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
} from 'constants';
import { IconRanks } from 'components/svg';
import AuthorBook from 'shared/author-book';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import ShareUsers from 'pages/home/components/newfeed/components/modal-share-users';
import { handleCheckReplyToMe } from 'reducers/redux-utils/comment';
import ShareTarget from 'shared/share-target';

const urlRegex =
	/(https?:\/\/)?(www(\.))?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

const verbShareArray = [
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
];

function Post({ postInformations, type }) {
	const [postData, setPostData] = useState({});
	const [videoId, setVideoId] = useState('');
	const { userInfo } = useSelector(state => state.auth);
	const [replyingCommentId, setReplyingCommentId] = useState(-1);
	const [mentionUsersArr, setMentionUsersArr] = useState([]);

	const clickReply = useRef(null);
	const doneGetPostData = useRef(false);
	const isLikeTemp = useRef(postInformations.isLike);

	const dispatch = useDispatch();
	const navigate = useNavigate();

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
		const newArr = [];
		mentionUsersArr.forEach(item => newArr.push(item.id));
		try {
			let res = {};
			if (type === REVIEW_TYPE) {
				const commentReviewData = {
					reviewId: postData.id,
					replyId: replyId,
					content: content,
					mediaUrl: [],
					mentionsUser: newArr,
				};
				res = await dispatch(createCommentReview(commentReviewData)).unwrap();
			} else if (type === POST_TYPE) {
				const params = {
					minipostId: postData.minipostId || postData.id,
					content: content,
					mediaUrl: [],
					mentionsUser: newArr,
					replyId: replyId,
				};
				res = await dispatch(createComment(params)).unwrap();
			} else {
				const params = {
					groupPostId: postData.groupPostId || postData.id,
					content: content,
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
		} catch (err) {
			NotificationError(err);
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
		}, 1500),
		[doneGetPostData.current]
	);

	const handleReply = (cmtLv1Id, userData) => {
		const arr = [];
		if (userData.id !== userInfo.id) {
			arr.push(userData);
			dispatch(handleCheckReplyToMe(false));
		} else {
			dispatch(handleCheckReplyToMe(true));
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
					{paramInfo.length - 1}
					{' người khác.'}
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
		if (content.match(urlRegex)) {
			let newContent;
			if (content.includes('https://')) {
				newContent = content.replace(urlRegex, data => {
					return `<a class="url-class" href=${data} target="_blank">${
						data.length <= 50 ? data : data.slice(0, 50) + '...'
					}</a>`;
				});
			} else {
				newContent = content.replace(urlRegex, data => {
					return `<a class="url-class" href=https://${data} target="_blank">${
						data.length <= 50 ? data : data.slice(0, 50) + '...'
					}</a>`;
				});
			}
			return newContent;
		} else {
			return content;
		}
	};

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
									<Link to={`/group/${postData.group?.id}`} className='post__name__group'>
										{postData.group?.name}
									</Link>
								</>
							)}
						</div>

						<div className='post__user-status__post-time-status'>
							<span>{calculateDurationTime(postData.time || postData.createdAt)}</span>
							<>
								{postData.book && (
									<div className='post__user-status__subtitle'>
										<span>Cập nhật tiến độ đọc sách</span>
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
						{`  cuốn sách tốt nhất ${
							postData.info.category ? ` thuộc ${postData.info.category.name}` : ''
						} theo ${handleTime()} `}
					</span>
					<IconRanks />
				</div>
			)}

			{verbShareArray.indexOf(postData.verb) !== -1 && (
				<div className='creat-post-modal-content__main__share-container'>
					{postData.verb === POST_VERB_SHARE && <PostShare postData={postData} />}
					{postData.verb === QUOTE_VERB_SHARE && <QuoteCard data={postData.sharePost} isShare={true} />}
					{postData.verb === GROUP_POST_VERB_SHARE && <PostShare postData={postData} />}
					{postData.verb === TOP_BOOK_VERB_SHARE && <AuthorBook data={postData} position='post' />}
					{postData.verb === TOP_QUOTE_VERB_SHARE && <QuoteCard data={postData.info} isShare={true} />}
				</div>
			)}
			{postData.verb === TOP_USER_VERB_SHARE && <ShareUsers postData={postData} />}
			{postData.book && (
				<PostBook
					data={{ ...postData.book, bookLibrary: postData.bookLibrary, actorCreatedPost: postData.actor }}
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
			{postData.usersComments && !!postData.usersComments?.length && (
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
};

Post.propTypes = {
	postInformations: PropTypes.object,
	type: PropTypes.string,
};

export default Post;
