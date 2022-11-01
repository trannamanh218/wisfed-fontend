import './modal-followers.scss';
import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { getListFollowrs } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import UserAvatar from 'shared/user-avatar';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ConnectButtonsFollower from './ConnectButtonsFollower';
import _ from 'lodash';

const ModalFollowers = ({ modalFollower, setModalFollower, userInfoDetail }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFollowing, setGetMyListFollowing] = useState([]);
	const [inputSearch, setValueSearch] = useState('');
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { userId } = useParams();
	useEffect(async () => {
		const param = {
			userId: userId,
		};
		try {
			const followList = await dispatch(getListFollowrs(param)).unwrap();
			const newArrFriend = followList.rows.map(item => {
				return { ...item, checkUnfollow: false, isPending: false, isAddFriend: true };
			});
			setGetMyListFollowing(
				newArrFriend.filter(
					x =>
						x.userOne.firstName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase()) ||
						x.userOne.lastName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase())
				)
			);
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch, inputSearch]);

	const toggleModal = () => {
		setModalFollower(!modalFollower);
	};

	const onChangeValueSearch = e => {
		setValueSearch(e.target.value);
	};

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
					<div className='modalFollowers__info'>
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
												{item?.dataCounting?.follower > 0 ? item?.dataCounting?.follower : 0}{' '}
												người theo dõi, {item?.dataCounting?.friend} bạn bè
											</p>
										)}
									</div>
								</div>
								<div className='author-card__right'>
									<ConnectButtonsFollower direction='row' item={item} />
								</div>
							</div>
						))}
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
