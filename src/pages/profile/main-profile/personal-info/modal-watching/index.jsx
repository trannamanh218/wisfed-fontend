import { CloseX } from 'components/svg';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getListFollowing } from 'reducers/redux-utils/user';
import SearchField from 'shared/search-field';
import UserAvatar from 'shared/user-avatar';
import ConnectButtonsFollower from '../modal-followers/ConnectButtonsFollower';

const ModalWatching = ({ setModalFollowing, modalFollowing, userInfoDetail }) => {
	const navigate = useNavigate();
	const { userInfo } = useSelector(state => state.auth);
	const [getListFollow, setGetListFollow] = useState([]);
	const [inputSearch, setInputSearch] = useState('');

	const dispatch = useDispatch();
	const { userId } = useParams();
	useEffect(async () => {
		const param = {
			userId: userId,
		};
		try {
			const followingList = await dispatch(getListFollowing(param)).unwrap();
			const newArrFriend = followingList.rows.map(item => {
				return { ...item, checkUnfollow: false, isPending: false, isAddFriend: true };
			});
			setGetListFollow(
				newArrFriend.filter(
					x =>
						x.userTwo?.firstName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase()) ||
						x.userTwo?.lastName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase())
				)
			);
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch, inputSearch]);

	const toggleModal = () => {
		setModalFollowing(!modalFollowing);
	};

	const onChangeInputSearch = e => {
		setInputSearch(e.target.value);
	};

	return (
		<>
			<Modal size='lg' className='modalFollowers__container__main' show={true} onHide={toggleModal}>
				<Modal.Body className='modalFollowers__container'>
					<div className='modalFollowers__header'>
						<div className='modalFollowers__title'>
							Người {userInfoDetail.firstName} {userInfoDetail.lastName} đang theo dõi
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
						{getListFollow.map(item =>
							item.checkUnfollow ? (
								''
							) : (
								<div key={item.id} className='author-card'>
									<div className='author-card__left'>
										<UserAvatar
											source={item?.userTwo?.avatarImage}
											className='author-card__avatar'
											size={'md'}
											handleClick={() => {
												toggleModal(), navigate(`/profile/${item.userIdTwo}`);
											}}
										/>

										<div className='author-card__info'>
											<h5
												onClick={() => {
													toggleModal(), navigate(`/profile/${item.userIdTwo}`);
												}}
											>
												{item.userTwo.firstName} {item.userTwo.lastName}
											</h5>
											{!_.isEmpty(item?.dataCounting) && (
												<p className='author-card__subtitle'>
													{item?.dataCounting?.follower > 0
														? item?.dataCounting?.follower
														: 0}{' '}
													người theo dõi,{' '}
													{item?.dataCounting?.friend > 0 ? item?.dataCounting?.friend : 0}{' '}
													bạn bè
												</p>
											)}
										</div>
									</div>
									<div className='author-card__right'>
										{item.relation !== 'isMe' && (
											<ConnectButtonsFollower direction='row' item={item} isFollower={false} />
										)}
									</div>
								</div>
							)
						)}
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};
ModalWatching.propTypes = {
	modalFollowing: PropTypes.bool,
	setModalFollowing: PropTypes.func,
	userInfoDetail: PropTypes.object,
};
export default ModalWatching;
