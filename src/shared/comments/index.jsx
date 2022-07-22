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
import { likeAndUnlikeCommentReview } from 'reducers/redux-utils/book';
import { POST_TYPE, QUOTE_TYPE, REVIEW_TYPE } from 'constants';
import { Link, useNavigate } from 'react-router-dom';
import { Like } from 'components/svg';

const urlRegex =
	/https?:\/\/www(\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

const Comment = ({ dataProp, handleReply, postData, commentLv1Id, type }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isAuthor, setIsAuthor] = useState(false);
	const [data, setData] = useState(dataProp);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLikeUnlikeCmt = async paramData => {
		const newCloneData = paramData;
		if (isLiked) {
			newCloneData.like -= 1;
			setData(newCloneData);
		} else {
			newCloneData.like += 1;
			setData(newCloneData);
		}

		try {
			if (type === POST_TYPE) {
				dispatch(likeAndUnlikeCommentPost(paramData.id));
			} else if (type === QUOTE_TYPE) {
				dispatch(likeQuoteComment(paramData.id));
			} else if (type === REVIEW_TYPE) {
				dispatch(likeAndUnlikeCommentReview(paramData.id));
			}
			setIsLiked(!isLiked);
		} catch (err) {
			NotificationError(err);
		}
	};

	const generateContent = content => {
		if (content.match(urlRegex)) {
			const newContent = content.replace(urlRegex, data => {
				return `<a class="url-class" href=${data} target="_blank">${
					data.length <= 50 ? data : data.slice(0, 50) + '...'
				}</a>`;
			});
			return newContent;
		} else {
			return content;
		}
	};

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
		if (data.isLike === true) {
			setIsLiked(true);
		} else {
			setIsLiked(false);
		}
	}, [data]);

	return (
		<div className='comment'>
			<UserAvatar
				className='comment__avatar'
				size='sm'
				source={data.user?.avatarImage ? data.user?.avatarImage : data['user.avatarImage']}
				handleClick={() => navigate(`/profile/${data.createdBy}`)}
			/>
			<div className='comment__wrapper'>
				<div className='comment__container'>
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
					{data?.content && (
						<p
							className='comment__content'
							dangerouslySetInnerHTML={{
								__html: generateContent(data.content),
							}}
						></p>
					)}
					{data.like !== 0 ? (
						<div className='cmt-like-number'>
							<div className='icon-like'>
								<Like />
							</div>
							{data.like}
						</div>
					) : null}
				</div>

				<ul className='comment__action'>
					<li
						className={classNames('comment__item', {
							'liked': isLiked,
						})}
						onClick={() => handleLikeUnlikeCmt(data)}
					>
						Thích
					</li>
					<li
						className='comment__item'
						onClick={() =>
							handleReply(commentLv1Id, {
								id: data.user.id,
								name: data.user.fullName || data.user.firstName + ' ' + data.user.lastName,
								avatar: data.user.avatarImage,
								link: `https://wisfeed.tecinus.vn/profile/1b4ade47-d03b-4a7a-98ea-27abd8f15a85`,
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
	dataProp: {},
	handleReply: () => {},
	postData: {},
	commentLv1Id: null,
	type: POST_TYPE,
};

Comment.propTypes = {
	dataProp: PropTypes.object,
	postData: PropTypes.object,
	handleReply: PropTypes.func,
	commentLv1Id: PropTypes.number,
	type: PropTypes.string,
};

export default Comment;
