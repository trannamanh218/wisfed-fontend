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

const Comment = ({ data, handleReply, postData, commentLv1Id, postCommentsLikedArray, inQuotes }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isAuthor, setIsAuthor] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		if (inQuotes) {
			if (data.createdBy === postData.createdBy) {
				setIsAuthor(true);
			}
		} else {
			if (data.createdBy === postData.actor) {
				setIsAuthor(true);
			}
		}
	}, []);

	useEffect(() => {
		if (postCommentsLikedArray.includes(data.id)) {
			setIsLiked(true);
		}
	}, [postCommentsLikedArray]);

	const handleLikeUnlikeQuoteCmt = async commentId => {
		try {
			const res = await dispatch(likeQuoteComment(commentId)).unwrap();
			setIsLiked(res?.liked);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='comment'>
			<UserAvatar className='comment__avatar' size='sm' source={data.user?.avatarImage} />
			<div className='comment__wrapper'>
				<div className='comment__container'>
					<div className='comment__header'>
						<span className='comment__author'>
							{data.user.name ||
								data.user.fullName ||
								data.user.lastName ||
								data.user.firstName ||
								'Không xác định'}
						</span>
						{isAuthor && (
							<Badge className='comment__badge' bg='primary-light'>
								Tác giả
							</Badge>
						)}
					</div>
					<p className='comment__content'>{data.content}</p>
				</div>

				<ul className='comment__action'>
					<li
						className={classNames('comment__item', {
							'liked': isLiked,
						})}
						onClick={() => handleLikeUnlikeQuoteCmt(data.id)}
					>
						Thích
					</li>
					<li className='comment__item' onClick={() => handleReply(commentLv1Id)}>
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
};

export default Comment;
