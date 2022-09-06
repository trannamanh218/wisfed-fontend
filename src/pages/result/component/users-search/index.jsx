import './users-search.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import ResultNotFound from '../result-not-found';
import defaultAvatar from 'assets/images/avatar.jpeg';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConnectButtonsSearch from './ConnectButtonsSearch';
import { useNavigate } from 'react-router-dom';

const UsersSearch = ({ isFetching, value, setIsFetching, searchResultInput, activeKeyDefault, updateBooks }) => {
	const [listArrayUsers, setListArrayUsers] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [hasMore, setHasMore] = useState(true);
	const [saveLocalSearch, setSaveLocalSearch] = useState([]);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	useEffect(() => {
		if (activeKeyDefault === 'users') {
			setListArrayUsers([]);
			callApiStart.current = 0;
			setHasMore(true);
		}
	}, [updateBooks, isShowModal, activeKeyDefault]);

	useEffect(() => {
		if (
			activeKeyDefault === 'users' &&
			callApiStart.current === 0 &&
			listArrayUsers.length === 0 &&
			searchResultInput.length > 0
		) {
			handleGetUserSearch();
		}
	}, [callApiStart.current, value, isShowModal, listArrayUsers]);

	const handleGetUserSearch = async () => {
		setIsFetching(true);
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			if (result.rows.length > 0) {
				callApiStart.current += callApiPerPage.current;
				setListArrayUsers(listArrayUsers.concat(result.rows));
			}
			// Nếu kết quả tìm kiếm nhỏ hơn limit thì disable gọi api khi scroll
			if (!result.rows.length || result.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		const getDataLocal = JSON.parse(localStorage.getItem('result'));
		if (getDataLocal) {
			setSaveLocalSearch(getDataLocal);
		}
	}, []);

	const onUserClick = item => {
		if (!saveLocalSearch.some(data => data.id === item.id)) {
			saveLocalSearch.unshift(item);
			localStorage.setItem('result', JSON.stringify(saveLocalSearch.slice(0, 8)));
		}
		navigate(`/profile/${item.id}`);
	};

	return (
		<div className='user__search__container'>
			{listArrayUsers?.length > 0 && activeKeyDefault === 'users' ? (
				<>
					<InfiniteScroll next={handleGetUserSearch} dataLength={listArrayUsers.length} hasMore={hasMore}>
						<div className='myfriends__layout__container'>
							{listArrayUsers.map(item => {
								if (item.relation !== 'isMe') {
									return (
										<div key={item.id} className='myfriends__layout'>
											<img
												className='myfriends__layout__img'
												src={item.avatarImage ? item.avatarImage : defaultAvatar}
												alt=''
												onClick={() => onUserClick(item)}
											/>
											<div className='myfriends__star'>
												<div className='myfriends__star__name'>
													{item.fullName ? (
														item.fullName
													) : (
														<>
															<span>{item.firstName}</span>&nbsp;
															<span>{item.lastName}</span>
														</>
													)}
												</div>
											</div>

											<div className='myfriends__button__container'>
												<ConnectButtonsSearch item={item} />
											</div>
										</div>
									);
								}
							})}
						</div>
					</InfiniteScroll>
				</>
			) : (
				isFetching === false && <ResultNotFound />
			)}
		</div>
	);
};

UsersSearch.propTypes = {
	setIsFetching: PropTypes.func,
	activeKeyDefault: PropTypes.string,
	searchResultInput: PropTypes.string,
	value: PropTypes.string,
	updateBooks: PropTypes.bool,
	isFetching: PropTypes.bool,
};

export default UsersSearch;
