import './users-search.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import ResultNotFound from '../result-not-found';
import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConnectButtonsSearch from './ConnectButtonsSearch';
import { useNavigate } from 'react-router-dom';
import Button from 'shared/button';
import LoadingIndicator from 'shared/loading-indicator';

const UsersSearch = ({ value, searchResultInput, activeKeyDefault, updateBooks }) => {
	const [listArrayUsers, setListArrayUsers] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [hasMore, setHasMore] = useState(true);
	const [saveLocalSearch, setSaveLocalSearch] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(8);

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
		if (listArrayUsers.length === 0) {
			setIsLoadingFirstTime(true);
		}
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
			setIsLoadingFirstTime(false);
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
			{isLoadingFirstTime ? (
				<LoadingIndicator />
			) : (
				<>
					{listArrayUsers?.length > 0 && activeKeyDefault === 'users' ? (
						<>
							<InfiniteScroll
								next={handleGetUserSearch}
								dataLength={listArrayUsers.length}
								hasMore={hasMore}
								loader={<LoadingIndicator />}
							>
								<div className='myfriends__layout__container'>
									{listArrayUsers.map((item, index) => {
										return (
											<div key={index} className='myfriends__layout'>
												<img
													className='myfriends__layout__img'
													src={item.avatarImage ? item.avatarImage : defaultAvatar}
													onError={e => e.target.setAttribute('src', defaultAvatar)}
													alt='img'
													onClick={() => onUserClick(item)}
												/>
												<div className='myfriends__star'>
													<div
														className='myfriends__star__name'
														onClick={() => onUserClick(item)}
													>
														{item.fullName
															? item.fullName
															: `${item.firstName} ${item.lastName}`}
													</div>
												</div>
												{item.relation !== 'isMe' ? (
													<div className='myfriends__button__container'>
														<ConnectButtonsSearch item={item} />
													</div>
												) : (
													<div
														className='myfriends__button__container'
														style={{ margin: 'auto 0' }}
													>
														<Button
															className='myfriends__button'
															onClick={() => navigate(`/profile/${item.id}`)}
														>
															<span style={{ fontSize: 'smaller' }}>
																<p>Xem trang</p>cá nhân<p></p>
															</span>
														</Button>
													</div>
												)}
											</div>
										);
									})}
								</div>
							</InfiniteScroll>
						</>
					) : (
						isFetching === false && <ResultNotFound />
					)}
				</>
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
	setIsLoadingFirstTime: PropTypes.func,
};

export default UsersSearch;
