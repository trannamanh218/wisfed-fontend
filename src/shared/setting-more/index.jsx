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
	createLibrary,
	removeBookInLibraries,
	updateMyAllLibraryRedux,
} from 'reducers/redux-utils/library';
import './setting-more.scss';
import { NotificationError } from 'helpers/Error';
import { updateCurrentBook } from 'reducers/redux-utils/book';
import { handleResetMyTargetReading, setMyTargetReading } from 'reducers/redux-utils/chart';

const SettingMore = ({ bookData, handleUpdateBookList }) => {
	const [showLibrariesModal, setShowLibrariesModal] = useState(false);
	const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
	const [currentStatus, setCurrentStatus] = useState(bookData.status);
	const [isVisible, setIsVisible] = useState(false);
	const [customLibrariesContainCurrentBookId, setCustomLibrariesContainCurrentBookId] = useState([]);

	const addedArray = useRef([]);
	const removedArray = useRef([]);
	const settingMoreContainer = useRef();
	const initalStatus = useRef(bookData.status);

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
		navigate(`/review/${bookData.id}/${userId}`);
	};

	const switchLibraries = async e => {
		e.stopPropagation();
		try {
			// lấy các id của thư viện custom chứa quyển sách hiện tại
			const arrId = [];
			for (let i = 0; i < myCustomLibraries.length; i++) {
				for (let j = 0; j < myCustomLibraries[i].books.length; j++) {
					if (myCustomLibraries[i].books[j].bookId === bookData.id) {
						arrId.push(myCustomLibraries[i].id);
					}
				}
			}
			setCustomLibrariesContainCurrentBookId(arrId);
		} catch (err) {
			NotificationError(err);
		} finally {
			setShowLibrariesModal(true);
			setIsVisible(false);
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

	const updateStatusBook = async () => {
		try {
			if (!_.isEmpty(bookData)) {
				const params = { bookId: bookData.id || bookData.bookId, type: currentStatus };
				await dispatch(addBookToDefaultLibrary(params)).unwrap();
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddAndRemoveBook = async () => {
		try {
			if (!_.isEmpty(addedArray.current) || !_.isEmpty(removedArray.current)) {
				await dispatch(
					addRemoveBookInLibraries({
						id: bookData.id || bookData.bookId,
						data: { add: addedArray.current, remove: removedArray.current },
					})
				).unwrap();
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleConfirm = () => {
		try {
			if (currentStatus !== initalStatus.current) {
				updateStatusBook();
				initalStatus.current = currentStatus;
				const customId = 'custom-id-SettingMore';
				toast.success('Chuyển giá sách thành công', { toastId: customId });
			}
			handleAddAndRemoveBook();
			dispatch(updateCurrentBook({ ...bookData, status: currentStatus }));
			setTimeout(() => {
				dispatch(updateMyAllLibraryRedux());
			}, 500);
			navigate('/');
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
		setCurrentStatus(initalStatus.current);
	};

	const closeDeleteBookModal = () => {
		setShowDeleteBookModal(false);
		setIsVisible(false);
	};

	const removeBook = async () => {
		const params = { bookId: bookData.id };
		try {
			await dispatch(removeBookInLibraries(params)).unwrap();
			handleUpdateBookList();
			dispatch(updateMyAllLibraryRedux());
			const customId = 'custom-id-SettingMore-success';
			toast.success('Xoá sách thành công', { toastId: customId });
			dispatch(setMyTargetReading([]));
			dispatch(handleResetMyTargetReading());
		} catch (err) {
			const customId = 'custom-id-SettingMore-warn';
			toast.warn('Lỗi không xóa được sách trong thư viện', { toastId: customId });
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
					{/* <li className='setting-more__item' onClick={handleClose}>
						<img className='setting-more__icon' alt='icon' src={clockIcon} />
						<span className='setting-more__text'>Lịch sử đọc</span>
					</li> */}
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
					<p className='main-shelves__modal__subtitle'>
						Cuốn sách sẽ được xoá khỏi TOÀN BỘ <p>giá sách</p>
					</p>
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
	handleUpdateBookList: () => {},
};

SettingMore.propTypes = {
	bookData: PropTypes.object,
	handleUpdateBookList: PropTypes.func,
};

export default SettingMore;
