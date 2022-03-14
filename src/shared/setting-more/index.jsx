import React from 'react';
import { useModal, useVisible } from 'shared/hooks';
import featherIcon from 'assets/images/feather.png';
import convertIcon from 'assets/images/convert.png';
import clockIcon from 'assets/images/clock.png';
import trashIcon from 'assets/images/trash.png';
import { Modal, ModalBody } from 'react-bootstrap';
import { CloseX } from 'components/svg';
import { useDispatch } from 'react-redux';
import { removeBookFromLibrary } from 'reducers/redux-utils/library';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import './setting-more.scss';
// import { getReviewOfBook } from 'reducers/redux-utils/book';
// import { generateQuery } from 'helpers/Common';
import { useNavigate } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';

const SettingMore = props => {
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const dispatch = useDispatch();
	const { bookData, handleRemoveBook } = props;
	const { ref, isVisible, setIsVisible } = useVisible(false);
	const navigate = useNavigate();

	const handleClose = () => {
		setIsVisible(!isVisible);
	};

	const handleDelete = () => {
		setIsVisible(!isVisible);
		setModalOpen(true);
	};

	const removeBook = async () => {
		const params = { id: bookData.library.id, bookId: bookData.id };
		try {
			await dispatch(removeBookFromLibrary(params));
			handleRemoveBook();
			toast.success('Xoá sách thành công');
		} catch (err) {
			toast.warn('Lỗi không xóa được sách trong thư viện');
		} finally {
			setModalOpen(false);
		}
	};

	const hanldeReviewBook = () => {
		navigate(RouteLink.reviewBookDetail('402', bookData?.name));
	};

	return (
		<div className='setting-more' ref={ref}>
			<button className='setting-more__btn' onClick={handleClose}>
				<span className='setting-more__dot' />
				<span className='setting-more__dot' />
			</button>

			{isVisible && (
				<ul className='setting-more__list'>
					<li className='setting-more__item' onClick={hanldeReviewBook}>
						<img className='setting-more__icon' alt='icon' src={featherIcon} />
						<span className='setting-more__text'>Xem bài review</span>
					</li>
					<li className='setting-more__item' onClick={handleClose}>
						<img className='setting-more__icon' alt='icon' src={convertIcon} />
						<span className='setting-more__text'>Chuyển tới giá sách khác</span>
					</li>
					<li className='setting-more__item' onClick={handleClose}>
						<img className='setting-more__icon' alt='icon' src={clockIcon} />
						<span className='setting-more__text'>Lịch sử đọc</span>
					</li>
					<li className='setting-more__item' onClick={handleDelete}>
						<img className='setting-more__icon' alt='icon' src={trashIcon} />
						<span className='setting-more__text'>Xóa</span>
					</li>
				</ul>
			)}

			<Modal className='main-shelves__modal' show={modalOpen} onHide={toggleModal} keyboard={false} centered>
				<span className='btn-closeX' onClick={toggleModal}>
					<CloseX />
				</span>
				<ModalBody>
					<h4 className='main-shelves__modal__title'>Bạn có muốn xóa cuốn sách?</h4>
					<p className='main-shelves__modal__subtitle'>
						{`Cuốn sách sẽ được xoá khỏi giá sách `}
						<br />
						<br />
						{`"${bookData?.library?.name}"`}
					</p>
					<button className='btn main-shelves__modal__btn-delete btn-danger' onClick={removeBook}>
						Xóa
					</button>
					<button className='btn-cancel' onClick={toggleModal}>
						Không
					</button>
				</ModalBody>
			</Modal>
		</div>
	);
};

SettingMore.defaultProps = {
	bookData: {},
	handleRemoveBook: () => {},
};

SettingMore.propTypes = {
	bookData: PropTypes.object,
	handleRemoveBook: PropTypes.func,
};

export default SettingMore;
