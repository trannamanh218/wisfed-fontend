import './modal-followers.scss';
import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import AuthorCard from 'shared/author-card';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { useModal } from 'shared/hooks';
import { useSelector } from 'react-redux';

const ModalFollowers = () => {
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);

	const { userInfo } = useSelector(state => state.auth);

	const favoriteAuthors = [...Array(4)];
	return (
		<>
			<li
				onClick={() => {
					setModalOpen(true);
				}}
				className='personal-info__item'
			>
				<span className='number'>825</span>
				<span>Người theo dõi</span>
			</li>
			<Modal size='lg' className='modalFollowers__container__main' show={modalOpen} onHide={toggleModal}>
				<Modal.Body className='modalFollowers__container'>
					<div className='modalFollowers__header'>
						<div className='modalFollowers__title'>
							Người theo dõi {userInfo.firstName} {userInfo.lastName}
						</div>
						<div className='modalFollowers__close'>
							<CloseX onClick={toggleModal} />
						</div>
					</div>
					<div className='modalFollowers__search'>
						<SearchField placeholder='Tìm kiếm trên Wisfeed' />
					</div>
					<div className='modalFollowers__info'>
						{favoriteAuthors.map((item, index) => (
							<AuthorCard direction={'row'} key={index} size={'md'} />
						))}
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};
ModalFollowers.propTypes = {
	idModalItem: PropTypes.string,
	setModalWatching: PropTypes.func,
};
export default ModalFollowers;
