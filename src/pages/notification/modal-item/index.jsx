import { backgroundToggle, readNotification, handleMentionCommentId } from 'reducers/redux-utils/notificaiton';
import UserAvatar from 'shared/user-avatar';
import { calculateDurationTime } from 'helpers/Common';
import { useNavigate } from 'react-router-dom';
import { ReplyFriendRequest, addFollower } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { renderMessage } from 'helpers/HandleShare';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateUser } from 'reducers/redux-utils/user';

const ModalItem = ({ item, setModalNoti, getNotifications, setGetNotifications, selectKey }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const { isReload } = useSelector(state => state.user);

	const [buttonNotClicked, setButtonNotClicked] = useState(true);

	const ReplyFriendReq = async (data, items) => {
		setButtonNotClicked(false);
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { reply: true } };
		try {
			await dispatch(ReplyFriendRequest(params)).unwrap();
			if (selectKey !== 'unread') {
				const newArr = getNotifications.map(item => {
					if (items.id === item.id) {
						const data = { ...item, isAccept: true };
						return { ...data };
					}
					return { ...item };
				});
				setGetNotifications(newArr);
			}
			await dispatch(readNotification({ notificationId: items.id })).unwrap();
			await dispatch(addFollower({ userId: items.actor })).unwrap();
			dispatch(updateUser(!isReload));
		} catch (err) {
			NotificationError(err);
		}
	};

	const cancelFriend = async (data, items) => {
		setButtonNotClicked(false);
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { reply: false } };
		try {
			await dispatch(ReplyFriendRequest(params)).unwrap();
			if (selectKey !== 'unread') {
				const newArr = getNotifications.map(item => {
					if (items.id === item.id) {
						const data = { ...item, isRefuse: true };
						return { ...data };
					}
					return { ...item };
				});
				setGetNotifications(newArr);
			}
			await dispatch(readNotification({ notificationId: items.id })).unwrap();
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleActiveIsReed = items => {
		const params = {
			notificationId: items.id,
		};

		switch (items.verb) {
			case 'likeMiniPost':
			case 'commentMiniPost':
			case 'likeGroupPost':
			case 'commentGroupPost':
				navigate(
					`/detail-feed/${
						items.verb === 'commentMiniPost' || items.verb === 'likeMiniPost' ? 'mini-post' : 'group-post'
					}/${items.originId?.minipostId || items.originId?.groupPostId}`
				);
				break;
			case 'follow':
			case 'addFriend':
			case 'friendAccepted':
				navigate(`/profile/${items.createdBy?.id || items.originId.userId}`);
				break;
			case 'topUserRanking':
				navigate(`/top100`);
				break;
			case 'readingGoal':
				navigate(`/reading-target/${userInfo.id}`);
				break;
			case 'inviteGroup':
				navigate(`/Group/${items.originId.groupId}`);
				break;
			case 'replyComment':
			case 'shareQuote':
				navigate(`/detail-feed/mini-post/${items.originId.minipostId}`);
				break;
			case 'commentQuote':
				navigate(`/quotes/detail/${items.originId.quoteId}`);
				break;
			case 'replyCommentQuote':
				dispatch(handleMentionCommentId(item.originId.commentQuoteId));
				navigate(`/quotes/detail/${items.originId.quoteId}`);
				break;
			case 'mention':
				switch (items.originId.type) {
					case 'commentQuote':
						dispatch(handleMentionCommentId(item.originId.commentQuoteId));
						navigate(`/quotes/detail/${items.originId.quoteId}`);
						break;
					case 'groupPost':
						navigate(`/detail-feed/group-post/${items.originId.groupPostId}`);
						break;
					case 'mentionMiniPost':
						navigate(`/detail-feed/mini-post/${items.originId.minipostId}`);
						break;
					case 'commentMiniPost':
						dispatch(handleMentionCommentId(item.originId.commentMiniPostId));
						navigate(`/detail-feed/mini-post/${items.originId.minipostId}`);
						break;
					default:
						navigate(`/detail-feed/mini-post/${items.originId.minipostId}`);
				}
				break;
			case 'likeQuote':
				navigate(`/quotes/detail/${items.originId.quoteId}`);
				break;
			case 'likeCommentReview':
				navigate(`/detail-feed/mini-post/${items.originId.minipostId}`);
				break;
			case 'requestGroup':
				navigate(`/group/${items.originId.groupId}`);
				break;
			case 'likeReview':
				navigate(`/review/${items.originId.bookId}/${userInfo.id}`);
				break;
			case 'likeCommentMiniPost':
				navigate(`/detail-feed/mini-post/${items.originId.minipostId}`);
				break;
			default:
				console.log('Xét thiếu verb: ', items.verb);
		}

		dispatch(backgroundToggle(true));
		setModalNoti(false);
		dispatch(readNotification(params)).unwrap();
	};

	return (
		<div
			className={
				(item.isRead || item.isAccept || item.isRefuse) && item.verb !== 'addFriend'
					? 'notificaiton__tabs__all__active'
					: 'notificaiton__tabs__all__seen'
			}
		>
			<div onClick={() => handleActiveIsReed(item)} className='notificaiton__all__layout'>
				<UserAvatar size='mm' source={item.createdBy?.avatarImage} />
				<div className='notificaiton__all__layout__status'>
					<div className='notificaiton__all__infor'>
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
														<span> {item.createdBy?.firstName}</span>
														<span> {item.createdBy?.lastName}</span>
													</>
												)}
											</span>{' '}
											{renderMessage(item)}
										</>
									)}
							</>
						)}
					</div>
					<div
						className={
							item.isRead || item.isAccept || item.isRefuse
								? 'notificaiton__all__status__seen'
								: 'notificaiton__all__status'
						}
					>{`${calculateDurationTime(item.time)}`}</div>
					{item.isAccept ? (
						<div className='notificaiton___main__all__status'>Đã chấp nhận lời mời</div>
					) : (
						item.isRefuse && <div className='notificaiton___main__all__status'>Đã từ chối lời mời</div>
					)}
				</div>
				<div
					className={
						item.isRead || item.isAccept || item.isRefuse
							? 'notificaiton__all__seen'
							: 'notificaiton__all__unseen'
					}
				></div>
			</div>
			{buttonNotClicked ? (
				<>
					{item.verb === 'addFriend' && (!item.isAccept || !item.isRefuse) && (
						<div className='notificaiton__all__friend'>
							<div
								onClick={() => ReplyFriendReq(item.object, item)}
								className='notificaiton__all__accept'
							>
								Chấp nhận
							</div>
							<div onClick={() => cancelFriend(item.object, item)} className='notificaiton__all__refuse'>
								Từ chối
							</div>
						</div>
					)}
				</>
			) : (
				''
			)}
		</div>
	);
};

ModalItem.propTypes = {
	item: PropTypes.object,
	setModalNoti: PropTypes.func,
	getNotifications: PropTypes.array,
	setGetNotifications: PropTypes.func,
	getListUnread: PropTypes.array,
	selectKey: PropTypes.string,
	setGetListUnRead: PropTypes.func,
};
export default ModalItem;
