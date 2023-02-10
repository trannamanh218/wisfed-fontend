import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { getFriendList } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import { NotificationError } from 'helpers/Error';
import { useParams, useNavigate } from 'react-router-dom';
import ConnectButtonsFriends from './ConnectButtonsFriends';
import _ from 'lodash';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';

const ModalFriend = ({ setModalFriend, modalFriend, userInfoDetail }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFriend, setGetMyListFriend] = useState([]);
	const [inputSearch, setInputSearch] = useState('');
	const [hasMore, setHasMore] = useState(true);
	const [filter, setFilter] = useState('[]');

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();
	const { userId } = useParams();
	const navigate = useNavigate();

	const toggleModal = () => {
		setModalFriend(!modalFriend);
	};

	useEffect(() => {
		setGetMyListFriend([]);
	}, [filter]);

	const onChangeInputSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const updateFilterSearch = value => {
		if (value) {
			const filterValue = [];
			filterValue.push({
				'operator': 'search',
				'value': value.trim(),
				'property': 'firstName,lastName',
			});
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter([]);
		}
	};

	const debounceSearch = useCallback(_.debounce(updateFilterSearch, 700), []);

	const getListFriendData = async () => {
		const query = {
			start: callApiStart.current,
			limit: callApiPerPage.current,
			filter: filter,
		};

		try {
			const friendList = await dispatch(getFriendList({ userId, query })).unwrap();
			const newArrFriend = friendList.rows.map(item => {
				return { ...item, checkFolow: false, checkUnfollow: false, checkUnfriend: true };
			});
			if (newArrFriend.length) {
				if (newArrFriend.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setGetMyListFriend(prev => [...prev, ...newArrFriend]);
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		callApiStart.current = 0;
		setHasMore(true);
		getListFriendData();
	}, [userInfo, filter]);

	return (
		<>
			<Modal size='lg' className='modalFollowers__container__main' show={true} onHide={toggleModal}>
				<Modal.Body className='modalFollowers__container'>
					<div className='modalFollowers__header'>
						<div className='modalFollowers__title'>
							Bạn bè của {userInfoDetail.firstName} {userInfoDetail.lastName}
						</div>
						<div className='modalFollowers__close'>
							<CloseX onClick={toggleModal} />
						</div>
					</div>
					<div className='modalFollowers__search'>
						<SearchField
							placeholder='Tìm kiếm trên Wisfeed'
							value={inputSearch}
							handleChange={onChangeInputSearch}
						/>
					</div>
					<div className='modalFollowers__info' id='scroll-friend'>
						<InfiniteScroll
							dataLength={getMyListFriend.length}
							next={getListFriendData}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
							scrollableTarget='scroll-friend'
						>
							{getMyListFriend.length > 0 ? (
								<>
									{getMyListFriend.map(item =>
										item.checkUnfriend ? (
											<div key={item.id} className='author-card'>
												<div className='author-card__left'>
													<UserAvatar
														source={item.userTwo?.avatarImage || item.avatarImage}
														className='author-card__avatar'
														size={'md'}
														handleClick={() => {
															toggleModal(), navigate(`/profile/${item.id}`);
														}}
													/>
													<div className='author-card__info'>
														<h5
															onClick={() => {
																toggleModal(), navigate(`/profile/${item.id}`);
															}}
														>
															{item.userTwo?.firstName || item.firstName}{' '}
															{item.userTwo?.lastName || item.lastName}
														</h5>
														{!_.isEmpty(item?.dataCounting) && (
															<p className='author-card__subtitle'>
																{item?.dataCounting?.follower > 0
																	? item?.dataCounting?.follower
																	: 0}{' '}
																người theo dõi,{' '}
																{item?.dataCounting?.friend > 0
																	? item?.dataCounting?.friend
																	: 0}{' '}
																bạn bè
															</p>
														)}
													</div>
												</div>
												<div className='author-card__right'>
													{(item.userTwo?.id || item.id) !== userInfo.id && (
														<ConnectButtonsFriends direction='row' item={item} />
													)}
												</div>
											</div>
										) : (
											''
										)
									)}
								</>
							) : (
								<span className='data__blank'>Chưa có dữ liệu</span>
							)}
						</InfiniteScroll>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};
ModalFriend.propTypes = {
	setModalFriend: PropTypes.func,
	modalFriend: PropTypes.bool,
	userInfoDetail: PropTypes.object,
};
export default ModalFriend;
