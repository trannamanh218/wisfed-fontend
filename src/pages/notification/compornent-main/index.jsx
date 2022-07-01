import './nottification.scss';
import { BackArrow } from 'components/svg';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import NormalContainer from 'components/layout/normal-container';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getNotification } from 'reducers/redux-utils/notificaiton';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import NotificationStatus from 'shared/notification-status';
import Circle from 'shared/loading/circle';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import { useState, useEffect, useRef } from 'react';

const Notification = () => {
	const [getNotifications, setGetNotifications] = useState([]);
	const [getListDefault, setListDefault] = useState([]);
	const keyTabsActive = useSelector(state => state.notificationReducer.activeKeyTabs);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const [hasMore, setHasMore] = useState(true);
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const getMyNotification = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};
			const notificationList = await dispatch(getNotification(params)).unwrap();
			if (notificationList.length) {
				callApiStart.current += callApiPerPage.current;
				setListDefault(getListDefault.concat(notificationList));
			} else {
				setHasMore(false);
			}
			return;
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (getListDefault.length > 0) {
			const arrNew = getListDefault.map(item => item.activities).flat(1);
			const newArr = arrNew.map(item => {
				const data = { ...item, isAccept: false, isRefuse: false };
				return { ...data };
			});
			setGetNotifications(newArr);
		}
	}, [getListDefault]);

	useEffect(() => {
		getMyNotification();
	}, [dispatch]);

	const lengthAddFriend = () => {
		const length = getNotifications.filter(item => item.verb === 'addFriend' && !item.isCheck);
		return length.length;
	};

	return (
		<NormalContainer>
			<Circle loading={isLoading} />
			{!isLoading && (
				<div className='notificaiton__main'>
					<div className='notificaiton__main__container'>
						<Link to={'/'} className='notificaiton__main__back'>
							<BackArrow />
						</Link>
						<div className='notificaiton__main__title'>Thông báo</div>
					</div>
					<div className='notificaiton__tabs_main'>
						<Tabs defaultActiveKey={keyTabsActive ? keyTabsActive : 'all'}>
							<Tab eventKey='all' title='Tất cả'>
								<div className='notificaiton__all__main__title'>Mới nhất</div>
								{getNotifications
									.slice(0, 1)
									.map(
										item =>
											!item.isCheck &&
											item && (
												<NotificationStatus
													key={item.id}
													item={item}
													setGetNotifications={setGetNotifications}
													getNotifications={getNotifications}
												/>
											)
									)}
								<div className='notificaiton__all__main__title'>Gần đây</div>
								<InfiniteScroll
									dataLength={getListDefault.length}
									next={getMyNotification}
									hasMore={hasMore}
									loader={<LoadingIndicator />}
								>
									{getNotifications
										.slice(1)
										.map(
											item =>
												!item.isCheck && (
													<NotificationStatus
														key={item.id}
														item={item}
														setGetNotifications={setGetNotifications}
														getNotifications={getNotifications}
													/>
												)
										)}
								</InfiniteScroll>
							</Tab>
							<Tab eventKey='unread' title='Chưa đọc'>
								<div className='notificaiton__all__main__title'>Thông báo chưa đọc</div>
								<InfiniteScroll
									dataLength={getListDefault.length}
									next={getMyNotification}
									hasMore={hasMore}
									loader={<LoadingIndicator />}
								>
									{getNotifications.map(
										item =>
											!item.isCheck &&
											!item.isRead && (
												<NotificationStatus
													key={item.id}
													item={item}
													setGetNotifications={setGetNotifications}
													getNotifications={getNotifications}
												/>
											)
									)}
								</InfiniteScroll>
							</Tab>
							<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
								<div className='notificaiton__all__main__title'>
									{lengthAddFriend()}&nbsp;lời kết bạn
								</div>
								{getNotifications.map(
									item =>
										item.verb === 'addFriend' &&
										!item.isCheck && (
											<NotificationStatus
												key={item.id}
												item={item}
												setGetNotifications={setGetNotifications}
												getNotifications={getNotifications}
											/>
										)
								)}
							</Tab>
						</Tabs>
					</div>
				</div>
			)}
		</NormalContainer>
	);
};

export default Notification;
