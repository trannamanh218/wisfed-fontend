import './notification-status.scss';
import PropTypes from 'prop-types';
import { calculateDurationTime } from 'helpers/Common';
import UserAvatar from 'shared/user-avatar';
import { renderMessage } from 'helpers/HandleShare';
import { replyFriendRequest } from 'reducers/redux-utils/user';
import {
	readNotification,
	updateReviewIdFromNoti,
	handleMentionCommentId,
	handleCheckIfMentionFromGroup,
	backgroundToggle,
} from 'reducers/redux-utils/notification';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import classNames from 'classnames';
import LoadingIndicator from 'shared/loading-indicator';
import logoNonText from 'assets/icons/logoNonText.svg';
import { replyInviteGroup } from 'reducers/redux-utils/group';

const NotificationStatus = ({ item, handleReplyFriendRequest }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [isRead, setIsRead] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [disableBackground, setDisableBackground] = useState(false);

	const { userInfo } = useSelector(state => state.auth);

	const appectRequest = async (requestId, option) => {
		setIsLoading(true);
		try {
			if (option === 'addFriend') {
				const params = { id: requestId, data: { reply: true } };
				await dispatch(replyFriendRequest(params)).unwrap();
			} else if (option === 'inviteGroup') {
				const params = { id: requestId, data: { accept: true } };
				await dispatch(replyInviteGroup(params)).unwrap();
			}
			handleReplyFriendRequest(requestId, option, true);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const refueRequest = async (requestId, option) => {
		setIsLoading(true);
		try {
			if (option === 'addFriend') {
				const params = { id: requestId, data: { reply: false } };
				await dispatch(replyFriendRequest(params)).unwrap();
			} else if (option === 'inviteGroup') {
				const params = { id: requestId, data: { accept: false } };
				await dispatch(replyInviteGroup(params)).unwrap();
			}
			handleReplyFriendRequest(requestId, option, false);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleActiveIsRead = () => {
		setIsRead(true);
		if (!item.isRead) {
			const params = {
				notificationId: item.id,
			};
			dispatch(readNotification(params)).unwrap();
		}
		dispatch(backgroundToggle(true));
		console.log(item);
		switch (item.verb) {
			case 'likeMiniPost':
			case 'commentMiniPost':
			case 'likeGroupPost':
			case 'commentGroupPost':
			case 'likeCommentGroupPost':
			case 'shareGroupPost':
				navigate(
					`/detail-feed/${
						item.verb === 'commentMiniPost' ||
						item.verb === 'likeMiniPost' ||
						item.verb === 'shareGroupPost'
							? 'mini-post'
							: 'group-post'
					}/${item.originId?.minipostId || item.originId?.groupPostId}`
				);
				break;
			case 'follow':
			case 'addFriend':
			case 'friendAccepted':
				navigate(`/profile/${item.createdBy?.id || item.originId.userId}`);
				break;
			case 'topUserRanking':
				navigate(`/top100`);
				break;
			case 'topBookRanking':
				navigate(`/top100`);
				break;
			case 'topQuoteRanking':
				navigate(`/top100`);
				break;
			case 'readingGoal':
				navigate(`/reading-target/${userInfo.id}`);
				break;
			case 'inviteGroup':
				navigate(`/Group/${item.originId.groupId}`);
				break;
			case 'replyComment':
				// case 'replyCommentMiniPost':
				dispatch(handleMentionCommentId(item.originId.replyId));
				navigate(`/detail-feed/mini-post/${item.originId.minipostId}`);
				break;
			case 'shareQuote':
				navigate(`/detail-feed/mini-post/${item.originId.minipostId}`);
				break;
			case 'commentQuote':
			case 'likeQuote':
				navigate(`/quotes/detail/${item.originId.quoteId}`);
				break;
			case 'likeCommentQuote':
				dispatch(handleMentionCommentId(item.originId.commentQuoteId));
				navigate(`/quotes/detail/${item.originId.quoteId}`);
				break;
			case 'replyCommentQuote':
				dispatch(handleMentionCommentId(item.originId.replyId));
				navigate(`/quotes/detail/${item.originId.quoteId}`);
				break;
			case 'mention':
				switch (item.originId.type) {
					case 'commentQuote':
						dispatch(handleMentionCommentId(item.originId.replyId));
						navigate(`/quotes/detail/${item.originId.quoteId}`);
						break;
					case 'groupPost':
						navigate(`/detail-feed/group-post/${item.originId.groupPostId}`);
						break;
					case 'mentionMiniPost':
					case 'commentMiniPost':
						dispatch(handleMentionCommentId(item.originId.replyId));
						navigate(`/detail-feed/mini-post/${item.originId.minipostId}`);
						break;
					case 'commentReview':
						dispatch(updateReviewIdFromNoti(item.originId.reviewId));
						navigate(`/review/${item.originId.bookId}/${userInfo.id}`);
						break;
					case 'commentGroupPost':
						dispatch(handleMentionCommentId(item.originId.commentGroupPostId));
						dispatch(handleCheckIfMentionFromGroup('group'));
						navigate(`/detail-feed/group-post/${item.originId.groupPostId}`);
						break;
					default:
						navigate(`/detail-feed/mini-post/${item.originId.minipostId}`);
				}
				break;
			case 'likeCommentReview':
				dispatch(updateReviewIdFromNoti(item.originId.reviewId));
				navigate(`/review/${item.originId.bookId}/${userInfo.id}`);
				break;
			case 'requestGroup':
				navigate(`/group/${item.originId.groupId}`);
				break;
			case 'likeReview':
			case 'commentReview':
				dispatch(updateReviewIdFromNoti(item.originId.reviewId));
				navigate(`/review/${item.originId.bookId}/${userInfo.id}`);
				break;
			// case 'replyCommentReview':
			// 	dispatch(handleMentionCommentId(paramItem.originId.replyId));
			// 	navigate(`/review/${paramItem.originId.bookId}/${paramUserInfo.id}`);
			// 	break;
			case 'likeCommentMiniPost':
			case 'sharePost':
				navigate(`/detail-feed/mini-post/${item.originId.minipostId}`);
				break;
			case 'finishReadingGoal':
				navigate(`/reading-target/${item.originId.userId}`);
				break;
			default:
				return;
		}
	};

	return (
		<div
			onClick={handleActiveIsRead}
			className={classNames('notification-status', {
				'readed': isRead || item.isRead,
				'friend-request': item.verb === 'addFriend' || item.verb === 'inviteGroup',
				'disable-background': disableBackground,
			})}
		>
			<div className='notification-status__main-content-wrapper'>
				{item.actor === 'system-notification' && item.verb !== 'friendAccepted' ? (
					<UserAvatar size='mm' source={logoNonText} className='system-notification__image' />
				) : (
					<UserAvatar size='mm' source={item.createdBy?.avatarImage} />
				)}
				<div className='notification-status__main-content'>
					<div className='notification-status__main-content__message'>
						{item.message ? (
							<p dangerouslySetInnerHTML={{ __html: item?.message }}></p>
						) : (
							<>
								{item.verb !== 'follow' &&
									item.verb !== 'requestGroup' &&
									item.verb !== 'commentGroupPost' &&
									item.verb !== 'commentQuote' &&
									item.verb !== 'inviteGroup' &&
									item.verb !== 'mention' && (
										<>
											<span>
												{item.createdBy?.fullName ? (
													item.createdBy.fullName
												) : (
													<>
														<span>{item.createdBy?.firstName}</span>
														<span>{item.createdBy?.lastName}</span>
													</>
												)}
											</span>
											{renderMessage(item)}
										</>
									)}
							</>
						)}
					</div>
					<div className='notification-status__main-content__time'>{`${calculateDurationTime(
						item?.time
					)}`}</div>
					{(item.verb === 'addFriend' || item.verb === 'inviteGroup') && (
						<>
							{item.isAccept !== undefined && (
								<>
									{item.isAccept ? (
										<div className='notification-status__reply-status'>Đã chấp nhận lời mời</div>
									) : (
										<div className='notification-status__reply-status'>Đã từ chối lời mời</div>
									)}
								</>
							)}
						</>
					)}
				</div>
				{item.verb !== 'addFriend' && item.verb !== 'inviteGroup' && (
					<div
						className={classNames('notification-status__read-status', {
							'readed': isRead || item.isRead,
						})}
					></div>
				)}
			</div>

			{item.isAccept === undefined && (item.verb === 'addFriend' || item.verb === 'inviteGroup') && (
				<div className='notification-status__reply-buttons'>
					{isLoading ? (
						<LoadingIndicator />
					) : (
						<>
							<div
								onClick={e => {
									e.stopPropagation();
									appectRequest(
										item.verb === 'addFriend' ? item.originId?.requestId : item.originId?.inviteId,
										item.verb
									);
								}}
								className='notification-status__reply-button accept'
								onMouseOver={() => setDisableBackground(true)}
								onMouseLeave={() => setDisableBackground(false)}
							>
								Chấp nhận
							</div>
							<div
								onClick={e => {
									e.stopPropagation();
									refueRequest(
										item.verb === 'addFriend' ? item.originId?.requestId : item.originId?.inviteId,
										item.verb
									);
								}}
								className='notification-status__reply-button refuse'
								onMouseOver={() => setDisableBackground(true)}
								onMouseLeave={() => setDisableBackground(false)}
							>
								Từ chối
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};

NotificationStatus.defaultProps = {
	item: {},
	handleReplyFriendRequest: () => {},
};

NotificationStatus.propTypes = {
	item: PropTypes.object,
	handleReplyFriendRequest: PropTypes.func,
};
export default NotificationStatus;
