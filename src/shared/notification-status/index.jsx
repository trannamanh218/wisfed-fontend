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
} from 'reducers/redux-utils/notification';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import LoadingIndicator from 'shared/loading-indicator';
import logoNonText from 'assets/icons/logoNonText.svg';
import { replyInviteGroup } from 'reducers/redux-utils/group';

const NotificationStatus = ({ item, setNotificationsList, notificationsList }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [isRead, setIsRead] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const notiArrTemp = useRef(notificationsList);

	const { userInfo } = useSelector(state => state.auth);

	useEffect(() => {
		notiArrTemp.current = [...notificationsList];
	}, [notificationsList]);

	const appectRequest = async (requestId, option) => {
		setIsLoading(true);

		try {
			if (option === 'addFriend') {
				const params = { id: requestId, data: { reply: true } };
				await dispatch(replyFriendRequest(params)).unwrap();
			} else if (option === 'inviteGroup') {
				const params = { id: requestId, body: { accept: true } };
				await dispatch(replyInviteGroup(params)).unwrap();
			}
			const newArr = notiArrTemp.current.map(noti => {
				if (noti.id === item.id) {
					const data = { ...noti, isAccept: true };
					return { ...data };
				}
				return { ...noti };
			});
			setNotificationsList(newArr);
			dispatch(readNotification({ notificationId: item.id })).unwrap();
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
				const params = { id: requestId, body: { accept: false } };
				await dispatch(replyInviteGroup(params)).unwrap();
			}

			const newArr = notiArrTemp.current.map(noti => {
				if (noti.id === item.id) {
					const data = { ...noti, isAccept: false };
					return { ...data };
				}
				return { ...noti };
			});
			setNotificationsList(newArr);
			dispatch(readNotification({ notificationId: item.id })).unwrap();
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
						dispatch(handleMentionCommentId(item.originId.commentQuoteId));
						navigate(`/quotes/detail/${item.originId.quoteId}`);
						break;
					case 'groupPost':
						navigate(`/detail-feed/group-post/${item.originId.groupPostId}`);
						break;
					case 'mentionMiniPost':
					case 'commentMiniPost':
						dispatch(handleMentionCommentId(item.originId.commentMiniPostId));
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
			case 'likeCommentMiniPost':
			case 'sharePost':
				navigate(`/detail-feed/mini-post/${item.originId.minipostId}`);
				break;
			case 'finishReadingGoal':
				navigate(`/reading-target/${item.originId.userId}`);
				break;
			default:
				console.log('Xét thiếu verb: ', item.verb);
		}
	};

	return (
		<div
			onClick={handleActiveIsRead}
			className={classNames('notification__tabs__main__all__seen', {
				'notification__tabs__main__all__active': isRead || item.isRead,
				'notification__tabs__main__all__friend-request':
					item.verb === 'addFriend' || item.verb === 'inviteGroup',
			})}
		>
			<div className='notification__all__main__layout'>
				{item.actor === 'system-notification' && item.verb !== 'friendAccepted' ? (
					<UserAvatar size='mm' source={logoNonText} className='system-notification__image' />
				) : (
					<UserAvatar size='mm' source={item.createdBy?.avatarImage} />
				)}
				<div className='notification__all__main__layout__status'>
					<div className='notification__main__all__infor'>
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
					<div className='notification__all__status'>{`${calculateDurationTime(item?.time)}`}</div>
					{(item.verb === 'addFriend' || item.verb === 'inviteGroup') && (
						<>
							{item.isAccept !== undefined && (
								<>
									{item.isAccept ? (
										<div className='notification___main__all__status'>Đã chấp nhận lời mời</div>
									) : (
										<div className='notification___main__all__status'>Đã từ chối lời mời</div>
									)}
								</>
							)}
						</>
					)}
				</div>

				<div className={isRead || item.isRead ? 'notification__all__seen' : 'notification__all__unseen'}></div>
			</div>

			{item.isAccept === undefined && (item.verb === 'addFriend' || item.verb === 'inviteGroup') && (
				<>
					<div className='notification__main__all__friend'>
						{isLoading ? (
							<LoadingIndicator />
						) : (
							<>
								<div
									onClick={e => {
										e.stopPropagation();
										appectRequest(
											item.verb === 'addFriend' ? item.originId?.requestId : item,
											item.verb
										);
									}}
									className='notification__main__all__accept'
								>
									Chấp nhận
								</div>
								<div
									onClick={e => {
										e.stopPropagation();
										refueRequest(
											item.verb === 'addFriend' ? item.originId?.requestId : item,
											item.verb
										);
									}}
									className='notification__main__all__refuse'
								>
									Từ chối
								</div>
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
};

NotificationStatus.propTypes = {
	item: PropTypes.object,
	setNotificationsList: PropTypes.func,
	notificationsList: PropTypes.array,
};
export default NotificationStatus;
