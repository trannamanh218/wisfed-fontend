import './nottification.scss';
import { BackArrow } from 'components/svg';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import avater from 'assets/images/image22.png';
import NormalContainer from 'components/layout/normal-container';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getNotification } from 'reducers/redux-utils/notificaiton';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import NotificationStatus from 'shared/notification-status';

const Notification = () => {
	const [getNotifications, setGetNotifications] = useState([]);
	const keyTabsActive = useSelector(state => state.notificationReducer.activeKeyTabs);
	const dispatch = useDispatch();

	const getMyNotification = async () => {
		try {
			const notificationList = await dispatch(getNotification()).unwrap();
			const arrNew = notificationList.map(item => item.activities).flat(1);
			const newArr = arrNew.map(item => {
				const data = { ...item, isAccept: false, isRefuse: false, isRead: false };
				return { ...data };
			});
			setGetNotifications(newArr);
			return;
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		getMyNotification();
	}, [dispatch]);

	const lengthAddFriend = () => {
		const length = getNotifications.filter(
			item => (item.verb === 'addfriend' || item.verb === 'addfriend') && item.isCheck
		);
		return length.length;
	};

	return (
		<NormalContainer>
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
							<div className='notificaiton__tabs__main__all'>
								<div className='notificaiton__all__main__layout'>
									<img className='notificaiton__all__main__layout__image' src={avater} alt='avatar' />
									<div className='notificaiton__all__main__layout__status'>
										<div className='notificaiton__main__all__infor'>
											<span>Trần Huy</span> đã cập nhật Trạng thái Review sách
										</div>
										<div className='notificaiton__all__status'>Gần đây nhất</div>
									</div>
									<div className='notificaiton__main__all__unseen'></div>
								</div>
							</div>
							<div className='notificaiton__all__main__title'>Gần đây</div>
							{getNotifications.map(item =>
								item.isCheck === true ? (
									''
								) : (
									<NotificationStatus
										key={item.id}
										item={item}
										setGetNotifications={setGetNotifications}
										getNotifications={getNotifications}
									/>
								)
							)}
						</Tab>
						<Tab eventKey='unread' title='Chưa đọc'>
							<div className='notificaiton__all__main__title'>Thông báo chưa đọc</div>
							{getNotifications.map(item =>
								item.isCheck === true ? (
									''
								) : (
									<NotificationStatus
										key={item.id}
										item={item}
										setGetNotifications={setGetNotifications}
										getNotifications={getNotifications}
									/>
								)
							)}
						</Tab>
						<Tab eventKey='friendrequest' title='Lời mời kết bạn'>
							<div className='notificaiton__all__main__title'>{lengthAddFriend()}&nbsp;lời kết bạn</div>
							{getNotifications.map(
								item =>
									(item.verb === 'addfriend' || item.verb === 'addFriend') &&
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
		</NormalContainer>
	);
};

export default Notification;
