import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import defaultAvatar from 'assets/images/avatar.jpeg';
import { useDispatch } from 'react-redux';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import Post from 'shared/post';
import './search-group.scss';
import _ from 'lodash';
import ResultNotFound from 'pages/result/component/result-not-found';
import { GROUP_TYPE } from 'constants';

function SearchLayout({ dataGroup }) {
	const [isCallApi, setIsCallApi] = useState(false);
	const dispatch = useDispatch();

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
		try {
			dispatch(unFriendRequest(item.id)).unwrap();
			setIsCallApi(!isCallApi);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleFollow = item => {
		try {
			dispatch(addFollower({ userId: item.id }));
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
			{_.isEmpty(dataGroup?.usersData) && _.isEmpty(dataGroup?.postData) ? (
				<div style={{ marginTop: '54px', padding: '24px' }}>
					<ResultNotFound />
				</div>
			) : (
				<div className='search-group__container'>
					{!_.isEmpty(dataGroup?.usersData) && (
						<div className='searh-group__member'>
							{dataGroup?.usersData?.map((item, index) => {
								return (
									<div className='member-item' key={index}>
										<div className='member-item__info'>
											<img
												src={item.avatarImage ? item.avatarImage : defaultAvatar}
												onError={e => e.target.setAttribute('src', defaultAvatar)}
												alt=''
											/>
											<div className='member-item__text'>
												<span>{item?.firstName + ' ' + item?.lastName || item.fullName}</span>
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
														Bỏ theo dõi
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
														- Hủy kết bạn
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
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
					<div>
						{dataGroup?.postData?.map((item, index) => {
							return <Post key={index} postInformations={item} type={GROUP_TYPE} />;
						})}
					</div>
				</div>
			)}
		</>
	);
}

SearchLayout.propTypes = {
	dataGroup: PropTypes.array,
};

export default SearchLayout;
