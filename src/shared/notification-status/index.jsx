import PropTypes from 'prop-types';
import { calculateDurationTime } from 'helpers/Common';
import UserAvatar from 'shared/user-avatar';
import { renderMessage } from 'helpers/HandleShare';
import { ReplyFriendRequest, CancelFriendRequest } from 'reducers/redux-utils/user';
import { readNotification } from 'reducers/redux-utils/notificaiton';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NotificationStatus = ({ item, setGetNotifications, getNotifications }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isRead, setIsRead] = useState(false);
	const { userInfo } = useSelector(state => state.auth);

	const ReplyFriendReq = async (data, items) => {
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { reply: true } };
		try {
			await dispatch(ReplyFriendRequest(params)).unwrap();
			const newArr = getNotifications.map(item => {
				if (items.id === item.id) {
					const data = { ...item, isAccept: true };
					return { ...data };
				}
				return { ...item };
			});
			setGetNotifications(newArr);
		} catch (err) {
			NotificationError(err);
		}
	};

	const cancelFriend = async (data, items) => {
		const parseObject = JSON.parse(data);
		const params = { id: parseObject.requestId, data: { level: 'normal' } };
		try {
			await dispatch(CancelFriendRequest(params)).unwrap();
			const newArr = getNotifications.map(item => {
				if (items.id === item.id) {
					const data = { ...item, isRefuse: true };
					return { ...data };
				}
				return { ...item };
			});
			setGetNotifications(newArr);
		} catch (err) {
			NotificationError(err);
		}
	};

	const hanleActiveIsReed = items => {
		const params = {
			notificationId: items.id,
		};

		setIsRead(true);
		if (
			items.verb === 'likeMiniPost' ||
			items.verb === 'commentMiniPost' ||
			items.verb === 'likeGroupPost' ||
			items.verb === 'commentGroupPost'
		) {
			navigate(
				`/detail-feed/${
					items.verb === 'commentMiniPost' || items.verb === 'likeMiniPost' ? 'mini-post' : 'group-post'
				}/${items.originId?.minipostId || items.originId?.groupPostId}`
			);
		} else if (items.verb === 'follow' || items.verb === 'addFriend' || items.verb === 'friendAccepted') {
			navigate(`/profile/${items.createdBy?.id || items.originId.userId}`);
		} else if (item.verb === 'topUserRanking') {
			navigate(`/top100`);
		} else if (item.verb === 'readingGoal') {
			navigate(`/reading-target/${userInfo.id}`);
		} else if (item.verb === 'inviteGroup') {
			navigate(`/Group/${items.originId.groupId}`);
		} else if (items.verb === 'replyComment' || items.verb === 'shareQuote') {
			navigate(`/detail-feed/${'mini-post'}/${items.originId.minipostId}`);
		} else if (items.verb === 'commentQuote') {
			navigate(`/quotes/detail/${items.originId.quoteId}`);
		} else if (items.verb === 'mention') {
			navigate(`/detail-feed/${'mini-post'}/${items.originId.minipostId}`);
		} else if (items.verb === 'likeQuote') {
			navigate(`/quotes/detail/${items.originId.quoteId}`);
		} else if (item.verb === 'likeCommentReview') {
			navigate(`/detail-feed/${'mini-post'}/${items.originId.minipostId}`);
		} else if (item.verb === 'requestGroup') {
			navigate(`/group/${items.originId.groupId}`);
		} else if (item.verb === 'likeReview') {
			navigate(`/review/${items.originId.bookId}/${userInfo.id}`);
		} else if (item.verb === 'likeCommentMiniPost') {
			navigate(`/detail-feed/mini-post/${items.originId.minipostId}`);
		}
		dispatch(readNotification(params)).unwrap();
	};

	return (
		<div
			onClick={() => hanleActiveIsReed(item)}
			className={
				isRead || item.isRead ? 'notificaiton__tabs__main__all__active' : 'notificaiton__tabs__main__all__seen'
			}
		>
			<div className='notificaiton__all__main__layout'>
				<UserAvatar size='mm' source={item.createdBy?.avatarImage} />
				<div className='notificaiton__all__main__layout__status'>
					<div className='notificaiton__main__all__infor'>
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
							item.isAccept || item.isRefuse
								? 'notificaiton__all__status__seen'
								: 'notificaiton__all__status'
						}
					>{`${calculateDurationTime(item?.time)}`}</div>
					{item.isAccept ? (
						<div className='notificaiton___main__all__status'>Đã chấp nhận lời mời</div>
					) : (
						item.isRefuse && <div className='notificaiton___main__all__status'>Đã từ chối lời mời</div>
					)}
				</div>

				<div className={isRead || item.isRead ? 'notificaiton__all__seen' : 'notificaiton__all__unseen'}></div>
			</div>

			{item.verb === 'addFriend' &&
				(item.isAccept || item.isRefuse ? (
					''
				) : (
					<div className='notificaiton__main__all__friend'>
						<div
							onClick={() => ReplyFriendReq(item.object, item)}
							className='notificaiton__main__all__accept'
						>
							{item.verb === 'browse' ? 'Duyệt' : 'Chấp nhận'}
						</div>
						<div
							onClick={() => cancelFriend(item.object, item)}
							className='notificaiton__main__all__refuse'
						>
							Từ chối
						</div>
					</div>
				))}
		</div>
	);
};

NotificationStatus.propTypes = {
	item: PropTypes.object,
	setGetNotifications: PropTypes.func,
	getNotifications: PropTypes.array,
};
export default NotificationStatus;
