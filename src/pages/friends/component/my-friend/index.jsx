import './my-friends.scss';
import FriendsItem from 'shared/friends';
import { getFriendList } from 'reducers/redux-utils/user';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { generateQuery } from 'helpers/Common';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';

const MyFriends = ({ activeTabs, inputSearch, filter, handleActiveTabs }) => {
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(9);
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const [getMyListFriend, setGetMyListFriend] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [toggleCallAPI, setToggleCallAPI] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [listFriendCount, setListFriendcount] = useState(0);

	useEffect(() => {
		callApiStart.current = 0;
		setIsLoading(true);
		setGetMyListFriend([]);
	}, [filter]);

	const getListFriendData = async () => {
		const query = generateQuery(callApiStart.current, callApiPerPage.current, inputSearch.length > 0 ? filter : '');

		const userId = userInfo.id;
		try {
			setHasMore(true);
			if (!_.isEmpty(userInfo)) {
				const friendList = await dispatch(getFriendList({ userId, query })).unwrap();
				setGetMyListFriend(prev => [...prev, ...friendList.rows]);
				setListFriendcount(friendList.count);
				callApiStart.current++;

				if (friendList.rows?.length === friendList.count || friendList.rows?.length < callApiPerPage.current) {
					setHasMore(false);
				}
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getListFriendData();
	}, [userInfo, filter, toggleCallAPI]);

	return (
		<>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<div className='myfriends__container'>
					<div className='myfriends__title'>
						({listFriendCount}) Bạn bè của{' '}
						{userInfo.fullName ? (
							userInfo.fullName
						) : (
							<>
								{userInfo.firstName}
								<span>{userInfo.lastName}</span>
							</>
						)}
					</div>

					{getMyListFriend?.length > 0 ? (
						<InfiniteScroll
							dataLength={getMyListFriend.length}
							next={() => {
								setToggleCallAPI(!toggleCallAPI);
							}}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							<div className='myfriends__layout__container'>
								{getMyListFriend.map(item => (
									<FriendsItem key={item.id} data={item} keyTabs={activeTabs} />
								))}
							</div>
						</InfiniteScroll>
					) : (
						<div style={{ textAlign: 'center', margin: '15px 0' }}>
							<p style={{ margin: '20px 0' }}>Bạn chưa có bạn bè nào, hãy thêm thật nhiều bạn bè nhé</p>
							<button className='btn btn-primary' onClick={() => handleActiveTabs('suggest')}>
								Thêm bạn bè
							</button>
						</div>
					)}
				</div>
			)}
		</>
	);
};
MyFriends.propTypes = {
	activeTabs: PropTypes.string,
	inputSearch: PropTypes.string,
	filter: PropTypes.string,
	handleActiveTabs: PropTypes.func,
};

export default MyFriends;
