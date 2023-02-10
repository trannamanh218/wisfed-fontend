import './modal-followers.scss';
import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';
import { getListFollowrs } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import UserAvatar from 'shared/user-avatar';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ConnectButtonsFollower from './ConnectButtonsFollower';
import _ from 'lodash';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import { formatNumbers } from 'constants';

const ModalFollowers = ({ modalFollower, setModalFollower, userInfoDetail }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFollowing, setGetMyListFollowing] = useState([]);
	const [inputSearch, setValueSearch] = useState('');
	const [hasMore, setHasMore] = useState(true);
	const [filter, setFilter] = useState('[]');

	const navigate = useNavigate();

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();
	const { userId } = useParams();

	useEffect(() => {
		setGetMyListFollowing([]);
	}, [filter]);

	const getListFollowerData = async () => {
		const param = {
			userId: userId,
			start: callApiStart.current,
			limit: callApiPerPage.current,
			filter: filter,
		};

		try {
			const followList = await dispatch(getListFollowrs(param)).unwrap();
			const newArrFriend = followList.rows.map(item => {
				return { ...item, checkUnfollow: false, isPending: false, isAddFriend: true };
			});
			if (newArrFriend.length) {
				if (newArrFriend.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setGetMyListFollowing(prev => [...prev, ...newArrFriend]);
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(async () => {
		setHasMore(true);
		callApiStart.current = 0;
		getListFollowerData();
	}, [userInfo, filter]);

	const toggleModal = () => {
		setModalFollower(!modalFollower);
	};

	const onChangeValueSearch = e => {
		setValueSearch(e.target.value);
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

	const goToUser = item => {
		toggleModal();
		navigate(`/profile/${item.userIdOne}`);
	};

	return (
		<>
			<Modal size='lg' className='modalFollowers__container__main' show={modalFollower} onHide={toggleModal}>
				<Modal.Body className='modalFollowers__container'>
					<div className='modalFollowers__header'>
						<div className='modalFollowers__title'>
							Người theo dõi {userInfoDetail.firstName} {userInfoDetail.lastName}
						</div>
						<div className='modalFollowers__close'>
							<CloseX onClick={toggleModal} />
						</div>
					</div>
					<div className='modalFollowers__search'>
						<SearchField
							placeholder='Tìm kiếm trên Wisfeed'
							value={inputSearch}
							handleChange={onChangeValueSearch}
						/>
					</div>
					<div className='modalFollowers__info' id='scroll-follower'>
						<InfiniteScroll
							dataLength={getMyListFollowing.length}
							next={getListFollowerData}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
							scrollableTarget='scroll-follower'
						>
							{getMyListFollowing.length > 0 ? (
								<>
									{getMyListFollowing.map(item => (
										<div key={item.id} className='author-card'>
											<div className='author-card__left' onClick={() => goToUser(item)}>
												<UserAvatar
													source={item.userOne.avatarImage}
													className='author-card__avatar'
													size={'md'}
												/>
												<div className='author-card__info'>
													<h5>
														{item.userOne.firstName} {item.userOne.lastName}
													</h5>
													{!_.isEmpty(item?.dataCounting) && (
														<p className='author-card__subtitle'>
															{item?.dataCounting?.follower > 0
																? formatNumbers(item?.dataCounting?.follower)
																: 0}{' '}
															người theo dõi,{' '}
															{item?.dataCounting?.friend > 0
																? formatNumbers(item?.dataCounting?.friend)
																: 0}{' '}
															bạn bè
														</p>
													)}
												</div>
											</div>
											<div className='author-card__right'>
												<ConnectButtonsFollower direction='row' item={item} isFollower={true} />
											</div>
										</div>
									))}
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
ModalFollowers.propTypes = {
	setModalFollower: PropTypes.func,
	modalFollower: PropTypes.bool,
	userInfoDetail: PropTypes.object,
};
export default ModalFollowers;
