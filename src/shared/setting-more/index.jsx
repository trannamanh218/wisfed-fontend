import clockIcon from 'assets/images/clock.png';
import convertIcon from 'assets/images/convert.png';
import featherIcon from 'assets/images/feather.png';
import trashIcon from 'assets/images/trash.png';
import StatusModalContainer from 'shared/status-modal/StatusModalContainer';
import { CloseX } from 'components/svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
	addBookToDefaultLibrary,
	addRemoveBookInLibraries,
	checkBookInLibraries,
	createLibrary,
	removeAllBookInLibraries,
	updateMyAllLibraryRedux,
} from 'reducers/redux-utils/library';
import './setting-more.scss';
import { NotificationError } from 'helpers/Error';
import { updateDirectFromProfile } from 'reducers/redux-utils/common';

const SettingMore = ({ bookData, handleUpdateBookList }) => {
	const [showLibrariesModal, setShowLibrariesModal] = useState(false);
	const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
	const [currentStatus, setCurrentStatus] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const [customLibrariesContainCurrentBookId, setCustomLibrariesContainCurrentBookId] = useState([]);

	const addedArray = useRef([]);
	const removedArray = useRef([]);
	const settingMoreContainer = useRef();

	const myCustomLibraries = useSelector(state => state.library.myAllLibrary).custom;

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userId } = useParams();

	const handleClickOutside = e => {
		if (!settingMoreContainer.current.contains(e.target)) {
			setIsVisible(false);
		}
	};

	useEffect(() => {
		if (settingMoreContainer.current) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const handleClose = () => {
		setIsVisible(!isVisible);
	};

	const handleDelete = () => {
		setIsVisible(!isVisible);
		setShowDeleteBookModal(true);
	};

	const hanldeReviewBook = () => {
		dispatch(updateDirectFromProfile(false));
		navigate(`/review/${bookData.id}/${userId}`);
	};

	const switchLibraries = async () => {
		try {
			const checkLibrariesData = await dispatch(checkBookInLibraries(bookData.id || bookData.bookId)).unwrap();
			const defaultLibrariesContainCurrentBook = checkLibrariesData.filter(
				item => item.library.isDefault === true
			);
			setCurrentStatus(defaultLibrariesContainCurrentBook[0].library.defaultType);
			const customLibrariesContainCurrentBook = checkLibrariesData.filter(
				item => item.library.isDefault === false
			);
			if (customLibrariesContainCurrentBook.length) {
				const arrId = [];
				customLibrariesContainCurrentBook.forEach(item => arrId.push(item.libraryId));
				setCustomLibrariesContainCurrentBookId(arrId);
			} else {
				setCustomLibrariesContainCurrentBookId([]);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setShowLibrariesModal(true);
			setIsVisible(false);
		}
	};

	const updateStatusBook = () => {
		if (!_.isEmpty(bookData)) {
			const params = { bookId: bookData.id || bookData.bookId, type: currentStatus };
			dispatch(addBookToDefaultLibrary(params));
		}
	};

	const updateBookShelve = async params => {
		try {
			await dispatch(createLibrary(params)).unwrap();
			dispatch(updateMyAllLibraryRedux());
		} catch (err) {
			NotificationError(err);
		}
	};

	const onChangeShelves = (data, option) => {
		if (option === 'add') {
			const index = removedArray.current.indexOf(data.id);
			if (index !== -1) {
				removedArray.current.splice(index, 1);
			}
			addedArray.current.push(data.id);
		} else {
			const index = addedArray.current.indexOf(data.id);
			if (index !== -1) {
				addedArray.current.splice(index, 1);
			}
			removedArray.current.push(data.id);
		}
	};

	const handleChangeStatus = statusSelected => {
		setCurrentStatus(statusSelected);
	};

	const handleAddAndRemoveBook = () => {
		if (!_.isEmpty(addedArray.current) || !_.isEmpty(removedArray.current)) {
			dispatch(
				addRemoveBookInLibraries({
					id: bookData.id || bookData.bookId,
					data: { add: addedArray.current, remove: removedArray.current },
				})
			);
		}
	};

	const handleConfirm = async () => {
		try {
			await updateStatusBook();
			await handleAddAndRemoveBook();
			toast.success('Chuyển giá sách thành công');
			setTimeout(() => {
				dispatch(updateMyAllLibraryRedux());
			}, 150);
		} catch (err) {
			NotificationError(err);
		} finally {
			setShowLibrariesModal(false);
			setIsVisible(false);
		}
	};

	const closeLibrariesModal = () => {
		setShowLibrariesModal(false);
		setIsVisible(false);
	};

	const closeDeleteBookModal = () => {
		setShowDeleteBookModal(false);
		setIsVisible(false);
	};

	const removeBook = async () => {
		const params = { bookId: bookData.id };
		try {
			await dispatch(removeAllBookInLibraries(params)).unwrap();
			handleUpdateBookList(bookData.id);
			dispatch(updateMyAllLibraryRedux());
			toast.success('Xoá sách thành công');
		} catch (err) {
			toast.warn('Lỗi không xóa được sách trong thư viện');
		} finally {
			setShowDeleteBookModal(false);
		}
	};

	return (
		<div className='setting-more' ref={settingMoreContainer}>
			<button className='setting-more__btn' onClick={handleClose} title='Tính năng khác'>
				<span className='setting-more__dot' />
				<span className='setting-more__dot' />
			</button>

			{isVisible && (
				<ul className='setting-more__list'>
					<li className='setting-more__item' onClick={hanldeReviewBook}>
						<img className='setting-more__icon' alt='icon' src={featherIcon} />
						<span className='setting-more__text'>Xem bài review</span>
					</li>
					<li className='setting-more__item' onClick={switchLibraries}>
						<img className='setting-more__icon' alt='icon' src={convertIcon} />
						<span className='setting-more__text'>Thay đổi giá sách</span>
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

			<Modal
				className='main-shelves__modal'
				show={showDeleteBookModal}
				onHide={closeDeleteBookModal}
				keyboard={false}
				centered
			>
				<span className='btn-closeX' onClick={closeDeleteBookModal}>
					<CloseX />
				</span>
				<ModalBody>
					<h4 className='main-shelves__modal__title'>Bạn có muốn xóa cuốn sách?</h4>
					<p className='main-shelves__modal__subtitle'>Cuốn sách sẽ được xoá khỏi TOÀN BỘ giá sách</p>
					<button className='btn main-shelves__modal__btn-delete btn-danger' onClick={removeBook}>
						Xóa
					</button>
					<button className='btn-cancel' onClick={closeDeleteBookModal}>
						Không
					</button>
				</ModalBody>
			</Modal>

			<Modal
				className='status-book-modal'
				show={showLibrariesModal}
				onHide={closeLibrariesModal}
				keyboard={false}
				centered
			>
				<Modal.Body>
					<StatusModalContainer
						currentStatus={currentStatus}
						handleChangeStatus={handleChangeStatus}
						bookShelves={myCustomLibraries}
						updateBookShelve={updateBookShelve}
						handleConfirm={handleConfirm}
						onChangeShelves={onChangeShelves}
						customLibrariesContainCurrentBookId={customLibrariesContainCurrentBookId}
					/>
				</Modal.Body>
			</Modal>
		</div>
	);
};

SettingMore.defaultProps = {
	bookData: {},
};

SettingMore.propTypes = {
	bookData: PropTypes.object,
};

export default SettingMore;
