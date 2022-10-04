import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { getFriendList } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import { NotificationError } from 'helpers/Error';
import { useParams, useNavigate } from 'react-router-dom';
import ConnectButtonsFriends from './ConnectButtonsFriends';

const ModalFriend = ({ setModalFriend, modalFriend, userInfoDetail }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFriend, setGetMyListFriend] = useState([]);
	const [inputSearch, setInputSearch] = useState('');
	const dispatch = useDispatch();
	const { userId } = useParams();
	const navigate = useNavigate();

	const toggleModal = () => {
		setModalFriend(!modalFriend);
	};

	const onChangeInputSearch = e => {
		setInputSearch(e.target.value);
	};

	useEffect(async () => {
		const param = {
			userId: userId,
		};
		try {
			const friendList = await dispatch(getFriendList(param)).unwrap();
			const newArrFriend = friendList.rows.map(item => {
				return { ...item, checkFolow: false, checkUnfollow: false, checkUnfriend: true };
			});
			setGetMyListFriend(
				newArrFriend.filter(
					x =>
						x.firstName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase()) ||
						x.lastName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase())
				)
			);
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch, inputSearch]);

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
					<div className='modalFollowers__info'>
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
											<p className='author-card__subtitle'>
												{item?.dataCounting?.follower} người theo dõi,{' '}
												{item?.dataCounting?.friend} bạn bè
											</p>
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
