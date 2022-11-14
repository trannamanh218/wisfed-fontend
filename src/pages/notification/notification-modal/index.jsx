import './modal-notification.scss';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	backgroundToggle,
	activeKeyTabsNotification,
	getListNotificationUnRead,
	handleUpdateNewNotification,
} from 'reducers/redux-utils/notification';
import { getNotification } from 'reducers/redux-utils/notification';
import { NotificationError } from 'helpers/Error';
import LoadingTimeLine from 'shared/loading-timeline';
import { getListReqFriendsToMe } from 'reducers/redux-utils/user';
import NotificationStatus from 'shared/notification-status';

const NotificationModal = ({ setModalNoti, buttonModal }) => {
	const [currentTab, setCurrentTab] = useState('all');
	const [isLoading, setIsLoading] = useState(true);
	const [notificationsList, setNotificationsList] = useState([]);
	const [notificationsUnreadList, setNotificationUnreadList] = useState([]);
	const [friendReqToMeCount, setFriendReqToMeCount] = useState(0);
	const [listAddFriendReqToMe, setListAddFriendReqToMe] = useState([]);

	const notifymodal = useRef(null);
	const loadingItemsNumber = useRef(1);
	const notiArrTemp = useRef(notificationsList);
	const friendRequestArrTemp = useRef(listAddFriendReqToMe);
	const tabOld = useRef(currentTab);

	const dispatch = useDispatch();

	const isNewNotificationByRealtime = useSelector(state => state.notificationReducer.isNewNotificationByRealtime);

	if (window.innerWidth >= 1280 && window.innerWidth <= 1366) {
		loadingItemsNumber.current = 6;
	} else if (window.innerWidth > 1440) {
		loadingItemsNumber.current = 9;
	} else {
		loadingItemsNumber.current = 8;
	}

	const handleClickOutside = e => {
		if (notifymodal.current && !notifymodal.current.contains(e.target) && !buttonModal.current.contains(e.target)) {
			setModalNoti(false);
			dispatch(backgroundToggle(true));
		}
	};

	useEffect(() => {
		if (notifymodal.current) {
			document.addEventListener('click', handleClickOutside, true);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	useEffect(() => {
		tabOld.current = currentTab;
		setIsLoading(true);
		if (currentTab === 'all') {
			getMyAllNotification();
		} else if (currentTab === 'unread') {
			getMyNotificationsUnread();
		} else {
			getListRequestFriendToMe();
		}
	}, [currentTab]);

	useEffect(() => {
		notiArrTemp.current = [...notificationsList];
	}, [notificationsList]);

	useEffect(() => {
		friendRequestArrTemp.current = [...listAddFriendReqToMe];
	}, [listAddFriendReqToMe]);

	useEffect(() => {
		if (currentTab === tabOld.current && isNewNotificationByRealtime) {
			if (currentTab === 'all') {
				getMyAllNotification();
			} else if (currentTab === 'unread') {
				getMyNotificationsUnread();
			} else {
				getListRequestFriendToMe();
			}
			dispatch(handleUpdateNewNotification(false));
		}
	}, [isNewNotificationByRealtime]);

	const getMyAllNotification = async () => {
		try {
			const params = {
				start: 0,
				limit: 5,
			};
			const res = await dispatch(getNotification(params)).unwrap();
			const newArr = res.filter(item => !item.isCheck);
			setNotificationsList(newArr);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const getMyNotificationsUnread = async () => {
		try {
			const params = {
				start: 0,
				limit: 5,
			};
			const res = await dispatch(getListNotificationUnRead(params)).unwrap();
			const newArr = res.filter(item => !item.isCheck);
			setNotificationUnreadList(newArr);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const getListRequestFriendToMe = async () => {
		try {
			const params = {
				start: 0,
				limit: 5,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
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
				setListAddFriendReqToMe(newArr);
			} else {
				setListAddFriendReqToMe([]);
			}
			setFriendReqToMeCount(res.count);
		} catch (error) {
			NotificationError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleNotification = () => {
		dispatch(backgroundToggle(true));
		setModalNoti(false);
		dispatch(activeKeyTabsNotification(currentTab));
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
	};

	return (
		<div className='notification-modal' ref={notifymodal}>
			<div className='notification-modal__header'>Thông báo</div>
			{isLoading ? (
				<div className='notification-modal__loading-container'>
					<LoadingTimeLine numberItems={loadingItemsNumber.current} />
				</div>
			) : (
				<Tabs onSelect={eventKey => setCurrentTab(eventKey)} defaultActiveKey='all' activeKey={currentTab}>
					<Tab eventKey='all' title='Tất cả'>
						<div className='notification-modal__content__title'>Mới nhất</div>
						{notificationsList.slice(0, 1).map(item => (
							<NotificationStatus
								key={item.id}
								item={item}
								setNotificationsList={setNotificationsList}
								notificationsList={notificationsList}
								handleReplyFriendRequest={handleReplyFriendRequest}
							/>
						))}
						<div className='notification-modal__content__title'>Gần đây</div>
						{notificationsList.slice(1, 6).map(item => (
							<NotificationStatus
								key={item.id}
								item={item}
								setNotificationsList={setNotificationsList}
								notificationsList={notificationsList}
								handleReplyFriendRequest={handleReplyFriendRequest}
							/>
						))}
						<Link to={`/notification`} onClick={handleNotification} className='notification__tab__button'>
							Xem tất cả
						</Link>
					</Tab>

					<Tab eventKey='unread' title='Chưa đọc'>
						{notificationsList.length > 0 ? (
							<>
								<div className='notification-modal__content__title'>Thông báo chưa đọc</div>
								{notificationsList
									.slice(0, 6)
									.map(
										item =>
											!item.isRead && (
												<NotificationStatus
													key={item.id}
													item={item}
													setNotificationsList={setNotificationsList}
													notificationsList={notificationsList}
													handleReplyFriendRequest={handleReplyFriendRequest}
												/>
											)
									)}
								<Link
									to={`/notification`}
									onClick={handleNotification}
									className='notification__tab__button'
								>
									Xem tất cả
								</Link>
							</>
						) : (
							<span className='no__notificaion'>Bạn không có thông báo nào</span>
						)}
					</Tab>

					<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
						{friendReqToMeCount ? (
							<>
								<div className='notification-modal__content__title'>
									{friendReqToMeCount} lời mời kết bạn
								</div>
								{listAddFriendReqToMe.map(item => (
									<NotificationStatus
										key={item.id}
										item={item}
										setNotificationsList={setNotificationsList}
										notificationsList={notificationsList}
										handleReplyFriendRequest={handleReplyFriendRequest}
									/>
								))}
								<Link
									to={`/notification`}
									onClick={handleNotification}
									className='notification__tab__button'
								>
									Xem tất cả
								</Link>
							</>
						) : (
							<span className='no__notificaion'>Bạn chưa có lời mời kết bạn nào</span>
						)}
					</Tab>
				</Tabs>
			)}
		</div>
	);
};

NotificationModal.propTypes = {
	setModalNoti: PropTypes.func,
	buttonModal: PropTypes.object,
};

export default NotificationModal;
