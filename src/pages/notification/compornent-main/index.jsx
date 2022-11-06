import './nottification.scss';
import { BackArrow } from 'components/svg';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import NormalContainer from 'components/layout/normal-container';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getNotification } from 'reducers/redux-utils/notification';
import { NotificationError } from 'helpers/Error';
import NotificationStatus from 'shared/notification-status';
import Circle from 'shared/loading/circle';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import { useState, useEffect, useRef } from 'react';
import { depenRenderNotification } from 'reducers/redux-utils/notification';
import { getListReqFriendsToMe } from 'reducers/redux-utils/user';

const Notification = () => {
	const [notificationsList, setNotificationsList] = useState([]);
	const [listDefault, setListDefault] = useState([]);
	const [listAddFriendReqToMe, setListAddFriendReqToMe] = useState([]);
	const [friendReqToMeCount, setFriendReqToMeCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [currentTab, setCurrentTab] = useState('all');

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const keyTabsActive = useSelector(state => state.notificationReducer.activeKeyTabs);
	const isRealTime = useSelector(state => state.notificationReducer.isRealTime);

	const dispatch = useDispatch();

	useEffect(() => {
		getListRequestFriendToMe();
	}, []);

	const getListRequestFriendToMe = async () => {
		const params = { sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]) };
		try {
			const res = await dispatch(getListReqFriendsToMe(params)).unwrap();
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
			setFriendReqToMeCount(res.count);
		} catch (error) {
			NotificationError(error);
		}
	};

	const getMyNotification = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};

			const res = await dispatch(getNotification(params)).unwrap();
			if (res.length) {
				callApiStart.current += callApiPerPage.current;
				setListDefault(listDefault.concat(res));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
			dispatch(depenRenderNotification(null));
		}
	};

	useEffect(() => {
		if (listDefault.length > 0 && !isRealTime) {
			const arrNew = listDefault.map(item => item.activities).flat(1);
			const arrFiltered = arrNew.filter(item => !item.isCheck);
			setNotificationsList(arrFiltered);
		}
	}, [listDefault, isRealTime]);

	useEffect(() => {
		if (!isRealTime) {
			getMyNotification();
		} else {
			callApiStart.current = 0;
			setListDefault([]);
		}
	}, [isRealTime]);

	return (
		<NormalContainer>
			<Circle loading={isLoading} />
			{!isLoading && (
				<div className='notification__main'>
					<div className='notification__main__container'>
						<Link to={'/'} className='notification__main__back'>
							<BackArrow />
						</Link>
						<div className='notification__main__title'>Thông báo</div>
					</div>
					<div className='notification__tabs_main'>
						<Tabs
							defaultActiveKey={keyTabsActive ? keyTabsActive : 'all'}
							onSelect={tabKey => setCurrentTab(tabKey)}
						>
							<Tab eventKey='all' title='Tất cả'>
								<div className='notification__all__main__title'>Mới nhất</div>
								{notificationsList.slice(0, 1).map(item => (
									<NotificationStatus
										key={item.id}
										item={item}
										setNotificationsList={setNotificationsList}
										notificationsList={notificationsList}
									/>
								))}
								<div className='notification__all__main__title'>Gần đây</div>
								<InfiniteScroll
									dataLength={listDefault.length}
									next={getMyNotification}
									hasMore={hasMore}
									loader={<LoadingIndicator />}
								>
									{notificationsList.slice(1).map(item => (
										<NotificationStatus
											key={item.id}
											item={item}
											setNotificationsList={setNotificationsList}
											notificationsList={notificationsList}
										/>
									))}
								</InfiniteScroll>
							</Tab>
							<Tab eventKey='unread' title='Chưa đọc'>
								<div className='notification__all__main__title'>Thông báo chưa đọc</div>
								<InfiniteScroll
									dataLength={listDefault.length}
									next={getMyNotification}
									hasMore={hasMore}
									loader={<LoadingIndicator />}
								>
									{notificationsList.map(
										item =>
											!item.isCheck &&
											!item.isRead && (
												<NotificationStatus
													key={item.id}
													item={item}
													setNotificationsList={setNotificationsList}
													notificationsList={notificationsList}
												/>
											)
									)}
								</InfiniteScroll>
							</Tab>
							{friendReqToMeCount > 0 && (
								<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
									<div className='notification__all__main__title'>
										{friendReqToMeCount} lời kết bạn
									</div>
									{listAddFriendReqToMe.map(item => (
										<NotificationStatus
											key={item.id}
											item={item}
											setNotificationsList={setListAddFriendReqToMe}
											notificationsList={listAddFriendReqToMe}
										/>
									))}
								</Tab>
							)}
						</Tabs>
					</div>
				</div>
			)}
		</NormalContainer>
	);
};

export default Notification;
