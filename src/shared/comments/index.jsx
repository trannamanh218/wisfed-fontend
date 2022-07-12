import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { calculateDurationTime } from 'helpers/Common';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import './comment.scss';
import { likeQuoteComment } from 'reducers/redux-utils/quote';
import { NotificationError } from 'helpers/Error';
import { likeAndUnlikeCommentPost } from 'reducers/redux-utils/activity';
import { POST_TYPE, QUOTE_TYPE, REVIEW_TYPE } from 'constants';
import { Link } from 'react-router-dom';

const Comment = ({ data, handleReply, postData, commentLv1Id, type }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isAuthor, setIsAuthor] = useState(false);

	const dispatch = useDispatch();

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

		if (data.isLike) {
			setIsLiked(true);
		} else {
			setIsLiked(false);
		}
	}, []);

	const handleLikeUnlikeCmt = async commentId => {
		try {
			if (type === POST_TYPE) {
				await dispatch(likeAndUnlikeCommentPost(commentId));
			} else if (type === QUOTE_TYPE) {
				await dispatch(likeQuoteComment(commentId));
			} else {
				console.log('like and unlike review comment');
			}
			setIsLiked(!isLiked);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='comment'>
			<UserAvatar
				className='comment__avatar'
				size='sm'
				source={data.user?.avatarImage ? data.user?.avatarImage : data['user.avatarImage']}
			/>
			<div className='comment__wrapper'>
				<div className='comment__container'>
					<Link to={`/profile/${postData.usersComments?.id || postData.commentQuotes?.id}`}>
						<div className='comment__header'>
							<Link to={`/profile/${data.user.id}`}>
								<span className='comment__author'>
									{data.user.name ||
										data.user.fullName ||
										data.user.lastName ||
										data.user.firstName ||
										'Không xác định'}
								</span>
							</Link>

							{isAuthor && (
								<Badge className='comment__badge' bg='primary-light'>
									Tác giả
								</Badge>
							)}
						</div>
					</Link>

					<p className='comment__content'>{data.content}</p>
				</div>

				<ul className='comment__action'>
					<li
						className={classNames('comment__item', {
							'liked': isLiked,
						})}
						onClick={() => handleLikeUnlikeCmt(data.id)}
					>
						Thích
					</li>
					<li
						className='comment__item'
						onClick={() =>
							handleReply(commentLv1Id, {
								userId: data.user.id,
								userFullName: data.user.fullName || data.user.firstName + ' ' + data.user.lastName,
							})
						}
					>
						Phản hồi
					</li>
					<li className='comment__item comment__item--timeline'>
						{`${calculateDurationTime(data.createdAt)}`}
					</li>
				</ul>
			</div>
		</div>
	);
};

Comment.defaultProps = {
	data: {},
	handleReply: () => {},
};

Comment.propTypes = {
	data: PropTypes.object,
	postData: PropTypes.object,
	handleReply: PropTypes.func,
	commentLv1Id: PropTypes.number,
	postCommentsLikedArray: PropTypes.array,
	inQuotes: PropTypes.bool,
	type: PropTypes.string,
};

export default Comment;
