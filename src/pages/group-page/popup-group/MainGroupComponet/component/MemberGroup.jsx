// import { MoreIcon } from 'components/svg';
import React, { useEffect, useState } from 'react';
import './memmber-group.scss';
import PropTypes from 'prop-types';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';
import { getMember } from 'reducers/redux-utils/group';

function MemberGroup() {
	const [listFriend, setListFriend] = useState([]);
	const [listFolow, setListFolow] = useState([]);
	const dispatch = useDispatch();
	const { id = '' } = useParams();
	const [memberGroups, setMemberGroups] = useState([]);
	const [isCallApi, setIsCallApi] = useState(false);

	const getListMember = async () => {
		try {
			const actionGetList = await dispatch(getMember(id)).unwrap();
			setMemberGroups(actionGetList);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		getListMember();
	}, [isCallApi]);

	useEffect(() => {
		const newListFolow = memberGroups.filter(item => item.isFollowMe === true);
		setListFolow(newListFolow);
		const newListFriend = memberGroups.filter(item => item.relation === 'friend');
		setListFriend(newListFriend);
	}, [memberGroups]);

	const handleAddFriend = item => {
		try {
			const param = {
				userId: item.id,
			};
			dispatch(makeFriendRequest(param)).unwrap();
			setIsCallApi(!isCallApi);
		} catch (err) {
			NotificationError(err);
		}
	};
	const handleUnFriend = item => {
		// setModalUnfriends(false);
		try {
			dispatch(unFriendRequest(item.id)).unwrap();
			setIsCallApi(!isCallApi);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleFollow = item => {
		try {
			const param = {
				data: { userId: item.id },
			};
			dispatch(addFollower(param)).unwrap();
			setIsCallApi(!isCallApi);
		} catch (err) {
			NotificationError(err);
		}
	};
	const handleUnFollow = item => {
		try {
			dispatch(unFollower(item.id)).unwrap();
			setIsCallApi(!isCallApi);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='member-group__container'>
			<div className='member-group__admin'>
				<h2>Quản trị viên và người kiểm duyệt</h2>
				{memberGroups?.map(item => {
					return (
						<>
							{item?.isAdmin && (
								<div className='member-item'>
									<div className='member-item__info'>
										<img
											src={
												item.avatar
													? item.avatar
													: 'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
											}
											onError={e =>
												e.target.setAttribute(
													'src',
													'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
												)
											}
											alt=''
										/>
										<div className='member-item__text'>
											<span>
												{item?.firstName + ' ' + item?.lastName || item.fullName} <br /> (Quản
												trị viên)
											</span>
											{item.mutualFriend ? (
												<p>
													{1 < item.mutualFriend.length < 10
														? `0${item.mutualFriend} `
														: item.mutualFriend}{' '}
													bạn chung
												</p>
											) : (
												''
											)}
										</div>
									</div>

									{item.relation !== 'isMe' && (
										<div style={{ display: 'flex' }}>
											{item.isFollow === true ? (
												<button
													className='member-item__btn btn-folow'
													onClick={() => handleUnFollow(item)}
												>
													Hủy theo dõi
												</button>
											) : (
												<button
													className='member-item__btn btn-folow'
													onClick={() => handleFollow(item)}
												>
													Theo dõi
												</button>
											)}
											{item.relation === 'friend' && (
												<button
													className='member-item__btn bnt-add-friend'
													onClick={() => handleUnFriend()}
												>
													- hủy kết bạn
												</button>
											)}
											{item.relation === 'pending' && (
												<button className='member-item__btn bnt-add-friend'>
													Đã gửi lời mời
												</button>
											)}
											{item.relation === 'unknown' && (
												<button className='member-item__btn bnt-add-friend'>+ Thêm bạn</button>
											)}
											{/* {item.isAdmin && (x
													<button className='more-icon-btn-group'>
														<MoreIcon />
													</button>
												)} */}
										</div>
									)}
								</div>
							)}
						</>
					);
				})}

				<hr />
			</div>

			<div className='member-group__friends'>
				<h2>Bạn bè</h2>
				{listFriend.length > 0
					? listFriend.map(item => {
							return (
								<>
									<div className='member-item'>
										<div className='member-item__info'>
											<img
												src={
													item.avatar
														? item.avatar
														: 'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
												}
												onError={e =>
													e.target.setAttribute(
														'src',
														'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
													)
												}
												alt=''
											/>
											<div className='member-item__text'>
												<span>{item.fullName}</span>
												{item.mutualFriend ? (
													<p>
														{1 < item.mutualFriend.length < 10
															? `0${item.mutualFriend} `
															: item.mutualFriend}{' '}
														bạn chung
													</p>
												) : (
													''
												)}
											</div>
										</div>

										{item.relation !== 'isMe' && (
											<div style={{ display: 'flex' }}>
												{item.isFollow === true ? (
													<button
														className='member-item__btn btn-folow'
														onClick={() => handleUnFollow(item)}
													>
														Hủy theo dõi
													</button>
												) : (
													<button
														className='member-item__btn btn-folow'
														onClick={() => handleFollow(item)}
													>
														Theo dõi
													</button>
												)}
												{item.relation === 'friend' && (
													<button
														className='member-item__btn bnt-add-friend'
														onClick={() => handleUnFriend(item)}
													>
														- hủy kết bạn
													</button>
												)}
												{item.relation === 'pending' && (
													<button className='member-item__btn bnt-add-friend'>
														Đã gửi lời mời
													</button>
												)}
												{item.relation === 'unknown' && (
													<button
														className='member-item__btn bnt-add-friend'
														onClick={() => handleAddFriend(item)}
													>
														+ Thêm bạn
													</button>
												)}
												{/* {item.isAdmin && (x
													<button className='more-icon-btn-group'>
														<MoreIcon />
													</button>
												)} */}
											</div>
										)}
									</div>
								</>
							);
					  })
					: 'Chưa có bạn bè tham gia'}
				<hr />
			</div>

			<div className='member-group__folower'>
				<h2>Người theo dõi</h2>
				{listFolow.length > 0
					? listFolow.map(item => {
							return (
								<>
									<div className='member-item'>
										<div className='member-item__info'>
											<img
												src={
													item.avatar
														? item.avatar
														: 'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
												}
												onError={e =>
													e.target.setAttribute(
														'src',
														'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
													)
												}
												alt=''
											/>
											<div className='member-item__text'>
												<span>{item.fullName}</span>
												{item.mutualFriend ? (
													<p>
														{1 < item.mutualFriend.length < 10
															? `0${item.mutualFriend} `
															: item.mutualFriend}{' '}
														bạn chung
													</p>
												) : (
													''
												)}
											</div>
										</div>
										{item.relation !== 'isMe' && (
											<div style={{ display: 'flex' }}>
												{item.isFollow === true ? (
													<button
														className='member-item__btn btn-folow'
														onClick={() => handleUnFollow(item)}
													>
														Hủy theo dõi
													</button>
												) : (
													<button
														className='member-item__btn btn-folow'
														onClick={() => handleFollow(item)}
													>
														Theo dõi
													</button>
												)}
												{item.relation === 'friend' && (
													<button
														className='member-item__btn bnt-add-friend'
														onClick={() => handleUnFriend(item)}
													>
														- hủy kết bạn
													</button>
												)}
												{item.relation === 'pending' && (
													<button className='member-item__btn bnt-add-friend'>
														Đã gửi lời mời
													</button>
												)}
												{item.relation === 'unknown' && (
													<button
														className='member-item__btn bnt-add-friend'
														onClick={() => handleAddFriend(item)}
													>
														+ Thêm bạn
													</button>
												)}
												{/* {item.isAdmin && (x
													<button className='more-icon-btn-group'>
														<MoreIcon />
													</button>
												)} */}
											</div>
										)}
									</div>
								</>
							);
					  })
					: 'Không có dữ liệu'}
				<div className='view-member-all'>
					<button>Xem tất cả</button>
				</div>
				<hr />
			</div>

			<div className='member-group__all-member'>
				<h2>Tất cả mọi người</h2>
				{memberGroups.map(item => {
					return (
						<>
							<div className='member-item'>
								<div className='member-item__info'>
									<img
										src={
											item.avatar
												? item.avatar
												: 'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
										}
										onError={e =>
											e.target.setAttribute(
												'src',
												'https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
											)
										}
										alt=''
									/>
									<div className='member-item__text'>
										<span>{item.fullName}</span>
										{item.mutualFriend ? (
											<p>
												{1 < item.mutualFriend.length < 10
													? `0${item.mutualFriend} `
													: item.mutualFriend}{' '}
												bạn chung
											</p>
										) : (
											''
										)}
									</div>
								</div>

								{item.relation !== 'isMe' && (
									<div style={{ display: 'flex' }}>
										{item.isFollow === true ? (
											<button
												className='member-item__btn btn-folow'
												onClick={() => handleUnFollow(item)}
											>
												Hủy theo dõi
											</button>
										) : (
											<button
												className='member-item__btn btn-folow'
												onClick={() => handleFollow(item)}
											>
												Theo dõi
											</button>
										)}

										{item.relation === 'friend' && (
											<button
												className='member-item__btn bnt-add-friend'
												onClick={() => handleUnFriend(item)}
											>
												- hủy kết bạn
											</button>
										)}
										{item.relation === 'pending' && (
											<button className='member-item__btn bnt-add-friend'>Đã gửi lời mời</button>
										)}
										{item.relation === 'unknown' && (
											<button
												className='member-item__btn bnt-add-friend'
												onClick={() => handleAddFriend(item)}
											>
												+ Thêm bạn
											</button>
										)}
										{/* {item.isAdmin && (x
													<button className='more-icon-btn-group'>
														<MoreIcon />
													</button>
												)} */}
									</div>
								)}
							</div>
						</>
					);
				})}
			</div>
		</div>
	);
}

MemberGroup.propTypes = {
	memberGroups: PropTypes.array,
};

export default MemberGroup;
