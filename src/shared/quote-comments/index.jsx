import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { calculateDurationTime } from 'helpers/Common';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import './quote-comment.scss';
import { likeQuoteComment, checkLikeQuoteComment } from 'reducers/redux-utils/quote';
import { toast } from 'react-toastify';

const QuoteComment = ({ data, handleReply, quoteData, commentLv1Id }) => {
	const [isLiked, setIsLiked] = useState(false);

	const dispatch = useDispatch();

	const isAuthor = data.createdBy === quoteData.createdBy;

	useEffect(() => {
		checkQuoteCommentLiked();
	}, []);

	const checkQuoteCommentLiked = async () => {
		try {
			const res = await dispatch(checkLikeQuoteComment()).unwrap();
			if (res.includes(data.id)) {
				setIsLiked(true);
			}
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	const handleLikeUnlikeQuoteCmt = async commentId => {
		try {
			const res = await dispatch(likeQuoteComment(commentId)).unwrap();
			setIsLiked(res.liked);
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	return (
		<div className='quote-comment'>
			<UserAvatar className='quote-comment__avatar' size='sm' source={data.user?.avatarImage} />
			<div className='quote-comment__wrapper'>
				<div className='quote-comment__container'>
					<div className='quote-comment__header'>
						<span className='quote-comment__author'>
							{data.user.name ||
								data.user.fullName ||
								data.user.lastName ||
								data.user.firstName ||
								'Không xác định'}
						</span>
						{isAuthor && (
							<Badge className='quote-comment__badge' bg='primary-light'>
								Tác giả
							</Badge>
						)}
					</div>
					<p className='quote-comment__content'>{data.content}</p>
				</div>

				<ul className='quote-comment__action'>
					<li
						className={classNames('quote-comment__item', {
							'liked': isLiked,
						})}
						onClick={() => handleLikeUnlikeQuoteCmt(data.id)}
					>
						Thích
					</li>
					<li className='quote-comment__item' onClick={() => handleReply(commentLv1Id)}>
						Phản hồi
					</li>
					<li className='quote-comment__item quote-comment__item--timeline'>
						{`${calculateDurationTime(data.createdAt)}`}
					</li>
				</ul>
			</div>
		</div>
	);
};

QuoteComment.defaultProps = {
	data: {},
	handleReply: () => {},
};

QuoteComment.propTypes = {
	data: PropTypes.object,
	quoteData: PropTypes.object,
	handleReply: PropTypes.func,
	commentLv1Id: PropTypes.number,
};

export default QuoteComment;
