import './my-friends.scss';
import FriendsItem from 'shared/friends';
import { checkListFriend, getFriendList } from 'reducers/redux-utils/user';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { generateQuery } from 'helpers/Common';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';

const MyFriends = ({ activeTabs, inputSearch, filter }) => {
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(9);

	const { userInfo } = useSelector(state => state.auth);
	const isFriend = useSelector(state => state.user.isFriend);
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

	const getFriendListData = async () => {
		const query = generateQuery(0, 10, filter);
		const userId = userInfo.id;
		try {
			setHasMore(true);
			if (!_.isEmpty(userInfo)) {
				const friendList = await dispatch(getFriendList({ userId, query })).unwrap();
				setGetMyListFriend(prev => [...prev, ...friendList.rows]);
				setListFriendcount(friendList.count);
				callApiStart.current++;

				if (friendList.rows?.length < callApiPerPage.current) {
					setHasMore(false);
				}
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(async () => {
		getFriendListData();
	}, [userInfo, dispatch, filter]);

	useEffect(() => {
		if (!getMyListFriend.length) {
			dispatch(checkListFriend(true));
		} else {
			dispatch(checkListFriend(false));
		}
	}, [getMyListFriend, isFriend]);

	return (
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
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<>
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
						<h5 style={{ margin: '22px' }}>Chưa có dữ liệu</h5>
					)}
				</>
			)}
		</div>
	);
};
MyFriends.propTypes = {
	activeTabs: PropTypes.string,
	inputSearch: PropTypes.string,
	filter: PropTypes.string,
	handleActiveTabs: PropTypes.func,
};

export default MyFriends;
