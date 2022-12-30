import './nottification.scss';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import NormalContainer from 'components/layout/normal-container';
import { useSelector, useDispatch } from 'react-redux';
import { getNotification } from 'reducers/redux-utils/notification';
import { NotificationError } from 'helpers/Error';
import NotificationStatus from 'shared/notification-status';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import { useState, useEffect, useRef } from 'react';
import { getListReqFriendsToMe } from 'reducers/redux-utils/user';
import LoadingTimeLine from 'shared/loading-timeline';
import BackButton from 'shared/back-button';

const Notification = () => {
	const keyTabsActive = useSelector(state => state.notificationReducer.activeKeyTabs);
	const isNewNotificationByRealtime = useSelector(state => state.notificationReducer.isNewNotificationByRealtime);

	const [notificationsList, setNotificationsList] = useState([]);
	const [listAddFriendReqToMe, setListAddFriendReqToMe] = useState([]);
	const [friendReqToMeCount, setFriendReqToMeCount] = useState(0);
	const [isLoadingAll, setIsLoadingAll] = useState(true);
	const [isLoadingFriendRequest, setIsLoadingFriendRequest] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
	const [currentTab, setCurrentTab] = useState(keyTabsActive);
	const [hasMoreFriendReq, setHasMoreFriendReq] = useState(true);

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);
	const callApiFriendReqStart = useRef(0);
	const callApiFriendReqPerPage = useRef(10);
	const notiArrTemp = useRef(notificationsList);
	const friendRequestArrTemp = useRef(listAddFriendReqToMe);

	const dispatch = useDispatch();

	useEffect(() => {
		getMyNotificationFirstTime();
		getListRequestFriendToMe();
	}, []);

	useEffect(() => {
		if (isNewNotificationByRealtime) {
			callApiStart.current = 10;
			getMyNotificationFirstTime();
			getListRequestFriendToMe();
		}
	}, [isNewNotificationByRealtime]);

	useEffect(() => {
		notiArrTemp.current = [...notificationsList];
	}, [notificationsList]);

	useEffect(() => {
		friendRequestArrTemp.current = [...listAddFriendReqToMe];
	}, [listAddFriendReqToMe]);

	const getMyNotificationFirstTime = async () => {
		setIsLoadingTimeline(true);
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
			};
			const res = await dispatch(getNotification(params)).unwrap();
			const newArr = res.filter(item => !item.isCheck);
			setNotificationsList(newArr);
			if (!newArr.length || newArr.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoadingAll(false);
			setIsLoadingTimeline(false);
		}
	};

	const getMyNotification = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};

			const res = await dispatch(getNotification(params)).unwrap();
			const newArr = res.filter(item => !item.isCheck);
			if (newArr.length) {
				callApiStart.current += callApiPerPage.current;
				setNotificationsList(notificationsList.concat(newArr));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoadingAll(false);
		}
	};

	const getListRequestFriendToMe = async () => {
		const params = {
			start: callApiFriendReqStart.current,
			limit: callApiFriendReqPerPage.current,
			sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
		};
		try {
			const res = await dispatch(getListReqFriendsToMe(params)).unwrap();
			if (res.rows.length) {
				const newArr = res.rows.map(item => {
					return {
						id: item.id,
						createdBy: { ...item.userOne },
						isCheck: false,
						isRead: false,
						originId: { requestId: item.id },
						time: item.createdAt,
						verb: 'addFriend',
					};
				});
				setListAddFriendReqToMe(listAddFriendReqToMe.concat(newArr));
				setFriendReqToMeCount(res.count);
			}
			if (!res.rows.length || res.rows.length < callApiFriendReqPerPage.current) {
				setHasMoreFriendReq(false);
			} else {
				callApiFriendReqStart.current += callApiFriendReqPerPage.current;
			}
		} catch (error) {
			NotificationError(error);
		} finally {
			setIsLoadingFriendRequest(false);
		}
	};

	const handleReplyFriendRequest = (requestId, option, replyStatus) => {
		const newNotiArr = notiArrTemp.current.map(noti => {
			if (option === 'addFriend') {
				if (noti?.originId?.requestId === requestId) {
					const data = { ...noti, isAccept: replyStatus };
					return { ...data };
				}
			} else if (option === 'inviteGroup') {
				if (noti?.originId?.inviteId === requestId) {
					const data = { ...noti, isAccept: replyStatus };
					return { ...data };
				}
			}
			return { ...noti };
		});
		setNotificationsList(newNotiArr);

		const newFriendRequestArr = friendRequestArrTemp.current.map(item => {
			if (item?.originId?.requestId === requestId) {
				const data = { ...item, isAccept: replyStatus };
				return { ...data };
			}
			return { ...item };
		});
		setListAddFriendReqToMe(newFriendRequestArr);
	};

	return (
		<NormalContainer>
			<div className='notification__main'>
				<div className='notification__main__container'>
					<BackButton destination={-1} />
					<div className='notification__main__title'>Thông báo</div>
				</div>
				<div className='notification__tabs__main'>
					<Tabs defaultActiveKey={keyTabsActive ? keyTabsActive : 'all'} onSelect={key => setCurrentTab(key)}>
						<Tab eventKey='all' title='Tất cả'>
							{currentTab === 'all' && (
								<>
									<div className='notification__all__main__title'>Mới nhất</div>
									{isLoadingAll || (isLoadingTimeline && isNewNotificationByRealtime) ? (
										<LoadingTimeLine numberItems={1} isTwoLines={false} />
									) : (
										<>
											{notificationsList.slice(0, 1).map(item => (
												<NotificationStatus
													key={item.id}
													item={item}
													handleReplyFriendRequest={handleReplyFriendRequest}
												/>
											))}
										</>
									)}
									<div
										className='notification__all__main__title'
										style={{ padding: '12px 8px 32px' }}
									>
										Gần đây
									</div>
									{isLoadingAll ? (
										<LoadingTimeLine numberItems={5} isTwoLines={false} />
									) : (
										<InfiniteScroll
											dataLength={notificationsList.length}
											next={getMyNotification}
											hasMore={hasMore}
											loader={<LoadingIndicator />}
										>
											{notificationsList.slice(1).map(item => (
												<NotificationStatus
													key={item.id}
													item={item}
													handleReplyFriendRequest={handleReplyFriendRequest}
												/>
											))}
										</InfiniteScroll>
									)}
								</>
							)}
						</Tab>
						<Tab eventKey='unread' title='Chưa đọc'>
							{currentTab === 'unread' && (
								<>
									<div className='notification__all__main__title'>Thông báo chưa đọc</div>
									{isLoadingAll ? (
										<LoadingTimeLine numberItems={5} isTwoLines={false} />
									) : (
										<InfiniteScroll
											dataLength={notificationsList.length}
											next={getMyNotification}
											hasMore={hasMore}
											loader={<LoadingIndicator />}
										>
											{notificationsList.map(
												item =>
													!item.isRead && (
														<NotificationStatus
															key={item.id}
															item={item}
															handleReplyFriendRequest={handleReplyFriendRequest}
														/>
													)
											)}
										</InfiniteScroll>
									)}
								</>
							)}
						</Tab>

						<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
							{currentTab === 'friendrequest' && (
								<>
									{isLoadingFriendRequest ? (
										<LoadingTimeLine numberItems={5} isTwoLines={false} />
									) : (
										<>
											<div className='notification__all__main__title'>
												{friendReqToMeCount} lời kết bạn
											</div>
											{friendReqToMeCount > 0 && (
												<InfiniteScroll
													dataLength={listAddFriendReqToMe.length}
													next={getListRequestFriendToMe}
													hasMore={hasMoreFriendReq}
													loader={<LoadingIndicator />}
												>
													{listAddFriendReqToMe.map(item => (
														<NotificationStatus
															key={item.id}
															item={item}
															handleReplyFriendRequest={handleReplyFriendRequest}
														/>
													))}
												</InfiniteScroll>
											)}
										</>
									)}
								</>
							)}
						</Tab>
					</Tabs>
				</div>
			</div>
		</NormalContainer>
	);
};

export default Notification;
