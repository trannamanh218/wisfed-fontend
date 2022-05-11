import clockIcon from 'assets/images/clock.png';
import convertIcon from 'assets/images/convert.png';
import featherIcon from 'assets/images/feather.png';
import trashIcon from 'assets/images/trash.png';
import StatusModalContainer from 'components/status-button/StatusModalContainer';
import { CircleCheckIcon, CloseX, CoffeeCupIcon, TargetIcon } from 'components/svg';
import { STATUS_BOOK } from 'constants';
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
	updateAuthLibrary,
} from 'reducers/redux-utils/library';
import { useModal } from 'shared/hooks';
import './setting-more.scss';
import { NotificationError } from 'helpers/Error';
import { updateDirectFromProfile } from 'reducers/redux-utils/common';

const STATUS_BOOK_OBJ = {
	'reading': {
		'name': 'Đang đọc',
		'value': STATUS_BOOK.reading,
		'icon': CoffeeCupIcon,
	},
	'read': {
		'name': 'Đã đọc',
		'value': STATUS_BOOK.read,
		'icon': CircleCheckIcon,
	},
	'wantToRead': {
		'name': 'Muốn đọc',
		'value': STATUS_BOOK.wantToRead,
		'icon': TargetIcon,
	},
};

const SettingMore = ({ bookData, handleUpdateLibrary }) => {
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const { modalOpen: statusModal, setModalOpen: setStatusModal } = useModal(false);
	const [currentStatus, setCurrentStatus] = useState(STATUS_BOOK_OBJ.wantToRead);
	const [bookLibraries, setBookLibaries] = useState([]);

	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef();
	const statusRef = useRef(STATUS_BOOK_OBJ.wantToRead);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userId } = useParams();

	const {
		library: { authLibraryData },
	} = useSelector(state => state);

	const handleClose = () => {
		setIsVisible(!isVisible);
	};

	const handleClickOutside = e => {
		if (statusModal) {
			return;
		} else {
			if (ref.current && !ref.current.contains(e.target)) {
				return setIsVisible(false);
			}
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, [statusModal]);

	const handleDelete = () => {
		setIsVisible(!isVisible);
		setModalOpen(true);
	};

	const removeBook = async () => {
		const params = { bookId: bookData.id };
		try {
			await dispatch(removeAllBookInLibraries(params)).unwrap();
			handleUpdateLibrary();
			toast.success('Xoá sách thành công');
		} catch (err) {
			toast.warn('Lỗi không xóa được sách trong thư viện');
		} finally {
			setModalOpen(false);
		}
	};

	const hanldeReviewBook = () => {
		dispatch(updateDirectFromProfile(false));
		navigate(`/review/${bookData.id}/${userId}`);
	};

	const switchLibraries = () => {
		let bookInLibraries = [];
		let initStatus = STATUS_BOOK.wantToRead;

		dispatch(checkBookInLibraries(bookData.id))
			.unwrap()
			.then(res => {
				const { rows } = res;

				if (_.isEmpty(rows)) {
					bookInLibraries = authLibraryData.rows.map(item => ({
						...item,
						isInLibrary: false,
						isSelect: false,
					}));
				} else {
					const currentLibraries = rows.map(item => ({ ...item.library }));
					bookInLibraries = authLibraryData.rows.map(item => {
						const newItem = { ...item, isInLibrary: false, isSelect: false };
						for (const lib of currentLibraries) {
							if (newItem.id === lib.id) {
								newItem.isInLibrary = true;
								newItem.isSelect = true;
								break;
							}
						}

						return newItem;
					});

					const currentStatusLibrary = currentLibraries.find(item => item.isDefault);

					if (!_.isEmpty(currentStatusLibrary)) {
						initStatus = STATUS_BOOK_OBJ[currentStatusLibrary.defaultType];
					}
				}

				setCurrentStatus(initStatus);
				statusRef.current = initStatus;
				setBookLibaries(bookInLibraries);
				setStatusModal(true);
			})
			.catch(err => {
				NotificationError(err);
			});
	};

	const updateStatusBook = () => {
		if (!_.isEmpty(bookData) && statusRef.current.value !== currentStatus.value) {
			const params = { bookId: bookData.id, type: currentStatus.value };
			return dispatch(addBookToDefaultLibrary(params)).unwrap();
		}
	};

	const updateBookShelve = async params => {
		try {
			const data = await dispatch(createLibrary(params)).unwrap();
			const newRows = [...authLibraryData.rows, data];
			dispatch(updateAuthLibrary({ rows: newRows, count: newRows.length }));
			const newBookLibraries = [...bookLibraries, { ...data, isInLibrary: false, isSelect: false }];
			setBookLibaries(newBookLibraries);
		} catch (err) {
			NotificationError(err);
		}
	};

	const onChangeShelves = data => {
		const newData = bookLibraries.map(item => {
			if (item.id === data.id) {
				return { ...item, isSelect: !item.isSelect };
			}
			return item;
		});

		setBookLibaries(newData);
	};

	const handleChangeStatus = data => {
		setCurrentStatus(data);
	};

	const handleAddAndRemoveBook = () => {
		if (!_.isEmpty(bookLibraries)) {
			const data = bookLibraries.reduce(
				(res, item) => {
					if (!item.isInLibrary && item.isSelect) {
						res.add.push(item.id);
						return res;
					}

					if (item.isInLibrary && !item.isSelect) {
						res.remove.push(item.id);
						return res;
					}

					return res;
				},
				{ add: [], remove: [] }
			);

			if (!_.isEmpty(data.add) || !_.isEmpty(data.remove)) {
				return dispatch(addRemoveBookInLibraries({ id: bookData.id, ...data }));
			}
		}
		return;
	};

	const handleConfirm = async () => {
		try {
			await updateStatusBook();
			await handleAddAndRemoveBook();
			toast.success('Chuyển giá sách thành công');
			handleUpdateLibrary();
		} catch (err) {
			toast.error('Lỗi chuyển giá sách');
		} finally {
			setStatusModal(false);
			setIsVisible(false);
		}
	};

	const handleCloseStatusModal = () => {
		setStatusModal(false);
		setIsVisible(false);
	};

	return (
		<div className='setting-more' ref={ref}>
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

			<Modal className='main-shelves__modal' show={modalOpen} onHide={toggleModal} keyboard={false} centered>
				<span className='btn-closeX' onClick={toggleModal}>
					<CloseX />
				</span>
				<ModalBody>
					<h4 className='main-shelves__modal__title'>Bạn có muốn xóa cuốn sách?</h4>
					<p className='main-shelves__modal__subtitle'>Cuốn sách sẽ được xoá khỏi TOÀN BỘ giá sách</p>
					<button className='btn main-shelves__modal__btn-delete btn-danger' onClick={removeBook}>
						Xóa
					</button>
					<button className='btn-cancel' onClick={toggleModal}>
						Không
					</button>
				</ModalBody>
			</Modal>

			<Modal
				id='status-book-modal'
				className='status-book-modal'
				show={statusModal}
				onHide={handleCloseStatusModal}
				keyboard={false}
				centered
			>
				<Modal.Body>
					<StatusModalContainer
						currentStatus={currentStatus}
						handleChangeStatus={handleChangeStatus}
						bookShelves={bookLibraries}
						updateBookShelve={updateBookShelve}
						handleConfirm={handleConfirm}
						onChangeShelves={onChangeShelves}
					/>
				</Modal.Body>
			</Modal>
		</div>
	);
};

SettingMore.defaultProps = {
	bookData: {},
	handleUpdateLibrary: () => {},
};

SettingMore.propTypes = {
	bookData: PropTypes.object,
	handleUpdateLibrary: PropTypes.func,
};

export default SettingMore;
