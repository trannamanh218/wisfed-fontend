import classNames from 'classnames';
import { Feather } from 'components/svg';
import { calculateDurationTime } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateReactionActivity } from 'reducers/redux-utils/activity';
import { createComment } from 'reducers/redux-utils/comment';
import Comment from 'shared/comment';
import CommentEditor from 'shared/comment-editor';
import GridImage from 'shared/grid-image';
import PostActionBar from 'shared/post-action-bar';
import PostBook from 'shared/post-book';
import UserAvatar from 'shared/user-avatar';
import './post.scss';

function Post({ postInformations, className, isUpdateProgressReading = false }) {
	const [postData, setPostData] = useState({});
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		const isLike = hasLikedPost();
		setPostData({ ...postInformations, isLike });
	}, [postInformations]);

	const hasLikedPost = () => {
		const { usersLikePost } = postInformations;
		let isLike = false;
		if (!_.isEmpty(usersLikePost) && !_.isEmpty(userInfo)) {
			const user = usersLikePost.find(item => item.user.id === userInfo.id);
			isLike = !_.isEmpty(user) ? user.liked : false;
		}

		return isLike;
	};

	const onCreateComment = (content, reply, parentData, indexParent) => {
		const params = {
			activityId: postData.activityId,
			content: content,
			mediaUrl: [],
			reply,
		};

		dispatch(createComment(params))
			.unwrap()
			.then(res => {
				const propertyComment = ['activityId', 'content', 'getstreamId', 'reply', 'id'];
				const newComment = _.pick(res, propertyComment);
				newComment.user = userInfo;
				newComment.replyComments = [];

				let usersComments = [];
				if (_.isEmpty(parentData)) {
					usersComments = [...postData.usersComments, newComment];
				} else {
					const replyComments = [...parentData.replyComments.slice(0, -1), newComment];
					usersComments = [
						...postData.usersComments.slice(0, indexParent),
						{ ...parentData, replyComments },
						...postData.usersComments.slice(indexParent + 1),
					];
				}

				setPostData(prev => ({ ...prev, usersComments, comments: ++prev.comments }));
			})
			.catch(err => {
				return err;
			});
	};

	const handleLikeAction = () => {
		const params = { activityId: postData.activityId };
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

	const isValidToAddReply = data => {
		if (data && data.replyComments && data.replyComments.length) {
			return data.replyComments.every(item => item.content);
		}

		return true;
	};

	const handleReply = (data, index, parentData, indexParent) => {
		const newData = {
			content: '',
			reply: parentData.id || data.id,
			activityId: postData.activityId,
			user: { ...userInfo },
			replyComments: [],
		};

		let usersComments = [];
		const isValid = _.isEmpty(parentData) ? isValidToAddReply(data) : isValidToAddReply(parentData);

		if (isValid) {
			if (_.isEmpty(parentData)) {
				const replyComments = [...data.replyComments, newData];

				usersComments = [
					...postData.usersComments.slice(0, index),
					{ ...data, replyComments },
					...postData.usersComments.slice(index + 1),
				];
			} else {
				const replyComments = [...parentData.replyComments, newData];

				usersComments = [
					...postData.usersComments.slice(0, indexParent),
					{ ...parentData, replyComments },
					...postData.usersComments.slice(indexParent + 1),
				];
			}

			return setPostData(prev => ({ ...prev, usersComments }));
		}
	};

	return (
		<div className={classNames('post__container', { [`${className}`]: className })}>
			<div className='post__user-status'>
				<UserAvatar
					data-testid='post__user-avatar'
					className='post__user-status__avatar'
					source={postData?.userAvatar}
				/>

				<div className='post__user-status__name-and-post-time-status'>
					<div data-testid='post__user-name' className='post__user-status__name'>
						{postData.actor || 'Ẩn danh'}
					</div>
					<div className='post__user-status__post-time-status'>
						<span>{calculateDurationTime(postData.time || postData.updatedAt)}</span>
						<>
							{isUpdateProgressReading && (
								<>
									<div className='post__user-status__post-time-status__online-dot'></div>
									<span style={{ color: '#656773' }}>Cập nhật tiến độ đọc sách</span>
								</>
							)}
						</>
					</div>
				</div>
			</div>
			<div className='post__description'>{postData.message || postData.content}</div>
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

			{postData.book && <PostBook data={postData.book} />}

			<GridImage images={postData.image} id={postData.id} />
			<PostActionBar postData={postData} handleLikeAction={handleLikeAction} />

			{postData.usersComments?.map((comment, index) => {
				if (comment.content) {
					return (
						<>
							<Comment
								key={`${comment.activityId}-${index}`}
								data={comment}
								postData={postData}
								handleReply={handleReply}
								index={index}
								indexParent={null}
							/>
							{comment.replyComments?.map((childComment, childIndex) => {
								if (childComment.content) {
									return (
										<Comment
											key={`child-${childComment.activityId}-${childIndex}`}
											data={childComment}
											postData={postData}
											handleReply={handleReply}
											index={childIndex}
											parentData={comment}
											indexParent={index}
										/>
									);
								}

								return (
									<CommentEditor
										key={`child-${childComment.activityId}-${childIndex}`}
										userInfo={userInfo}
										postData={postData}
										onCreateComment={onCreateComment}
										className='reply-comment'
										reply={childComment.reply}
										parentData={comment}
										indexParent={index}
									/>
								);
							})}
						</>
					);
				}

				return (
					<CommentEditor
						key={`${comment.activityId}-${index}`}
						userInfo={userInfo}
						postData={postData}
						onCreateComment={onCreateComment}
						className='reply-comment'
						reply={comment.reply}
						indexParent={null}
					/>
				);
			})}
			<CommentEditor
				userInfo={userInfo}
				postData={postData}
				onCreateComment={onCreateComment}
				reply={null}
				indexParent={null}
			/>
		</div>
	);
}
Post.propTypes = {
	postInformations: PropTypes.object,
	likeAction: PropTypes.func,
	className: PropTypes.string,
	isUpdateProgressReading: PropTypes.bool,
};

export default Post;
