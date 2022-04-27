import classNames from 'classnames';
import { Feather } from 'components/svg';
import { calculateDurationTime } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateReactionActivity } from 'reducers/redux-utils/activity';
import { createComment } from 'reducers/redux-utils/comment';
import CommentEditor from 'shared/comment-editor';
import GridImage from 'shared/grid-image';
import PostActionBar from 'shared/post-action-bar';
import PostBook from 'shared/post-book';
import UserAvatar from 'shared/user-avatar';
import './post.scss';
import PreviewLink from 'shared/preview-link/PreviewLink';
import { NotificationError } from 'helpers/Error';
import ReactRating from 'shared/react-rating';
import { useParams } from 'react-router-dom';
import { createCommentReview } from 'reducers/redux-utils/book';
import Comment from 'shared/comments';

function Post({ postInformations, className }) {
	const [postData, setPostData] = useState({});
	const [videoId, setVideoId] = useState('');
	const { userInfo } = useSelector(state => state.auth);
	const [commentLv1IdArray, setCommentLv1IdArray] = useState([]);
	const [replyingCommentId, setReplyingCommentId] = useState(null);
	const [clickReply, setClickReply] = useState(false);

	const dispatch = useDispatch();

	const { bookId } = useParams();

	useEffect(() => {
		const isLike = hasLikedPost();
		setPostData({ ...postInformations, isLike });
		if (!_.isEmpty(postInformations.preview) && postInformations.preview.url.includes('https://www.youtube.com/')) {
			const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			const match = postInformations.preview.url.match(regExp);
			if (match && match[2].length === 11) {
				setVideoId(match[2]);
			}
		}
	}, [postInformations]);

	const directUrl = url => {
		window.open(url, '_blank');
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

	useEffect(() => {
		const urlAddedArray = document.querySelectorAll('.url-color');
		if (urlAddedArray.length > 0) {
			for (let i = 0; i < urlAddedArray.length; i++) {
				urlAddedArray[i].addEventListener('click', () => {
					directUrl(urlAddedArray[i].innerText);
				});
			}
		}
	}, [postData]);

	const hasLikedPost = () => {
		const { usersLikePost } = postInformations;
		let isLike = false;
		if (!_.isEmpty(usersLikePost) && !_.isEmpty(userInfo)) {
			const user = usersLikePost.find(item => item.user.id === userInfo.id);
			isLike = !_.isEmpty(user) ? user.liked : false;
		}
		return isLike;
	};

	const onCreateComment = async (content, replyId) => {
		try {
			let res = {};
			if (bookId) {
				const commentReviewData = {
					reviewId: postData.id,
					replyId: replyId,
					content: content,
					mediaUrl: [],
					mentionsUser: [],
				};
				res = await dispatch(createCommentReview(commentReviewData)).unwrap();
			} else {
				const params = {
					minipostId: postData.minipostId,
					content: content,
					mediaUrl: [],
					mentionsUser: [],
					replyId: replyId,
				};
				res = await dispatch(createComment(params)).unwrap();
			}
			if (!_.isEmpty(res)) {
				const newComment = { ...res, user: userInfo };
				const usersComments = [...postData.usersComments, newComment];
				const newPostData = { ...postData, usersComments, comments: postData.comments + 1 };
				setPostData(newPostData);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleLikeAction = () => {
		const params = { minipostId: postData.minipostId };
		dispatch(updateReactionActivity(params))
			.unwrap()
			.then(() => {
				const setLike = !postData.isLike;
				const numberOfLike = setLike ? postData.like + 1 : postData.like - 1;
				setPostData(prev => ({ ...prev, isLike: !prev.isLike, like: numberOfLike }));
			})
			.catch(() => {
				return;
			});
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

	const handleReply = cmtLv1Id => {
		setReplyingCommentId(cmtLv1Id);
		setClickReply(!clickReply);
	};

	return (
		<div className={classNames('post__container', { [`${className}`]: className })}>
			<div className='post__user-status'>
				<UserAvatar
					data-testid='post__user-avatar'
					className='post__user-status__avatar'
					source={postData?.createdBy?.avatarImage}
				/>

				<div className='post__user-status__name-and-post-time-status'>
					<div data-testid='post__user-name' className='post__user-status__name'>
						{postData?.createdBy?.fullName || 'Ẩn danh'}
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
											postInformations?.book?.actorRating?.star
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
			<div
				className='post__description'
				dangerouslySetInnerHTML={{
					__html: postData.message || postData.content,
				}}
			></div>
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

			{postData.book && <PostBook data={{ ...postData.book, bookLibrary: postData.bookLibrary }} />}

			{postData?.image?.length > 0 && <GridImage images={postData.image} inPost={true} />}

			{postData?.image?.length === 0 && !_.isEmpty(postData?.preview) && (
				<>
					{videoId ? (
						<iframe
							className='post__video-youtube'
							src={`//www.youtube.com/embed/${videoId}`}
							frameBorder={0}
							allowFullScreen={true}
						></iframe>
					) : (
						<div onClick={() => directUrl(postInformations.preview.url)}>
							<PreviewLink isFetching={false} urlData={postInformations.preview} />
						</div>
					)}
				</>
			)}
			<PostActionBar postData={postData} handleLikeAction={handleLikeAction} />

			{postData.usersComments?.map(comment => (
				<div key={comment.id}>
					{comment.replyId === null && (
						<Comment
							commentLv1Id={comment.id}
							data={comment}
							postData={postData}
							handleReply={handleReply}
							postCommentsLikedArray={[]}
							inQuotes={false}
						/>
					)}
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
											postCommentsLikedArray={[]}
											inQuotes={false}
										/>
									</div>
								);
							}
						})}
						{commentLv1IdArray.includes(comment.id) && (
							<CommentEditor
								userInfo={userInfo}
								onCreateComment={onCreateComment}
								className={classNames('reply-comment-editor', {
									'show': comment.id === replyingCommentId,
								})}
								replyId={replyingCommentId}
								textareaId={`textarea-${comment.id}`}
							/>
						)}
					</div>
				</div>
			))}
			<CommentEditor userInfo={userInfo} onCreateComment={onCreateComment} reply={null} indexParent={null} />
		</div>
	);
}

Post.propTypes = {
	postInformations: PropTypes.object,
	likeAction: PropTypes.func,
	className: PropTypes.string,
};

export default Post;
