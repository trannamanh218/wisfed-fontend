import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import defaultAvatar from 'assets/images/avatar.jpeg';
import { useDispatch } from 'react-redux';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import Post from 'shared/post';
import Circle from 'shared/loading/circle';
import './search-group.scss';
import _ from 'lodash';
import ResultNotFound from 'pages/result/component/result-not-found';

function SearchLayout({ data }) {
	const [isCallApi, setIsCallApi] = useState(false);
	const dispatch = useDispatch();
	const [listPost, setListPost] = useState([]);
	const [listMember, setListMember] = useState([]);
	const [isFetching, setIsFetching] = useState(true);

	useEffect(() => {
		setListMember(data.usersData);
		setListPost(data.postData);
		setTimeout(() => {
			setIsFetching(false);
		}, 1000);
	}, [data]);

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
		<>
			{_.isEmpty(listMember) && _.isEmpty(listPost) && isFetching === false ? (
				<div className='not-found-group'>
					<ResultNotFound />
				</div>
			) : (
				<div className='search-group__container'>
					<Circle loading={isFetching} />
					{!_.isEmpty(data?.usersData) && (
						<div className='searh-group__member'>
							{listMember?.map(item => {
								return (
									<>
										{' '}
										<div className='member-item'>
											<div className='member-item__info'>
												<img
													src={item.avatarImage ? item.avatarImage : defaultAvatar}
													onError={e => e.target.setAttribute('src', defaultAvatar)}
													alt=''
												/>
												<div className='member-item__text'>
													<span>
														{item?.firstName + ' ' + item?.lastName || item.fullName}
													</span>
													{item.mutualFriend ? (
														<p>
															{item.mutualFriend < 10
																? `0${item.mutualFriend} `
																: `${item.mutualFriend} `}
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
														<button
															className='member-item__btn bnt-add-friend'
															style={{ backgroundColor: '#EFF0F6', opacity: '0.8' }}
														>
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
							})}
						</div>
					)}

					<div></div>
					<div>
						{listPost?.map(item => {
							return (
								<>
									<Post postInformations={item} />
								</>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}

SearchLayout.propTypes = {
	data: PropTypes.array,
};

export default SearchLayout;
