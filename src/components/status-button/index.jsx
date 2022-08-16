import classNames from 'classnames';
import { CircleCheckIcon, CoffeeCupIcon, TargetIcon, DropdownGroupWhite } from 'components/svg';
import WrapIcon from 'components/wrap-icon';
import { STATUS_BOOK } from 'constants/index';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
	addBookToDefaultLibrary,
	addRemoveBookInLibraries,
	checkBookInLibraries,
	createLibrary,
	updateMyAllLibraryRedux,
} from 'reducers/redux-utils/library';
import './status-button.scss';
import StatusModalContainer from 'shared/status-modal/StatusModalContainer';
import Circle from 'shared/loading/circle';
import { updateCurrentBook } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import Storage from 'helpers/Storage';
import ModalCheckLogin from 'shared/modal-check-login';

const STATUS_BOOK_OBJ = {
	reading: {
		'name': 'Đang đọc',
		'value': STATUS_BOOK.reading,
		'icon': CoffeeCupIcon,
	},
	read: {
		'name': 'Đã đọc',
		'value': STATUS_BOOK.read,
		'icon': CircleCheckIcon,
	},
	wantToRead: {
		'name': 'Muốn đọc',
		'value': STATUS_BOOK.wantToRead,
		'icon': TargetIcon,
	},
};

const StatusButton = ({ className, bookData, inCreatePost, bookStatus }) => {
	const [modalShow, setModalShow] = useState(false);
	const [currentStatus, setCurrentStatus] = useState('');
	const [initalStatus, setInitialStatus] = useState('');
	const [fetchStatus, setFetchStatus] = useState(false);
	const [customLibrariesContainCurrentBookId, setCustomLibrariesContainCurrentBookId] = useState([]);

	const addedArray = useRef([]);
	const removedArray = useRef([]);

	const navigate = useNavigate();
	const { userInfo } = useSelector(state => state.auth);
	const myCustomLibraries = useSelector(state => state.library.myAllLibrary).custom;

	const dispatch = useDispatch();

	useEffect(async () => {
		if (Storage.getAccessToken()) {
			setCurrentStatus(bookStatus);
			setInitialStatus(bookStatus);
		} else {
			setCurrentStatus(STATUS_BOOK.wantToRead);
		}
	}, [bookStatus]);

	const handleClose = () => {
		setModalShow(false);
	};

	const handleShow = async e => {
		console.log('btn Status', bookData);
		e.stopPropagation();
		//check duoc trang thai co trong thu vien
		try {
			const checkLibrariesData = await dispatch(checkBookInLibraries(bookData.id || bookData.bookId)).unwrap();
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
			setModalShow(true);
		}
		setModalShow(true);
	};

	const updateBookShelve = async params => {
		try {
			await dispatch(createLibrary(params)).unwrap();
			dispatch(updateMyAllLibraryRedux());
		} catch (err) {
			NotificationError(err);
		}
	};

	const updateStatusBook = async () => {
		if (!_.isEmpty(bookData)) {
			const params = { bookId: bookData.id || bookData.bookId, type: currentStatus };
			await dispatch(addBookToDefaultLibrary(params)).unwrap();
		}
	};

	const handleAddAndRemoveBook = async () => {
		if (!_.isEmpty(addedArray.current) || !_.isEmpty(removedArray.current)) {
			await dispatch(
				addRemoveBookInLibraries({
					id: bookData.id || bookData.bookId,
					data: { add: addedArray.current, remove: removedArray.current },
				})
			).unwrap();
		}
	};

	const handleConfirm = () => {
		if (!inCreatePost) {
			setFetchStatus(true);
			try {
				if (currentStatus !== initalStatus) {
					updateStatusBook();
					setInitialStatus(currentStatus);
				}
				handleAddAndRemoveBook();
				dispatch(updateCurrentBook({ ...bookData, status: currentStatus }));
				navigate('/');
			} catch (err) {
				NotificationError(err);
			} finally {
				setModalShow(false);
				setFetchStatus(false);
			}
		}
	};

	const handleChangeStatus = statusSelected => {
		setCurrentStatus(statusSelected);
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

	return (
		<>
			<Circle loading={fetchStatus} />
			<button
				className={classNames('btn btn-status btn-primary', {
					[`${className}`]: className,
					'disable': inCreatePost,
				})}
				data-testid='btn-modal'
				onClick={handleShow}
			>
				<WrapIcon
					className='btn-status__icon'
					component={currentStatus ? STATUS_BOOK_OBJ[currentStatus].icon : STATUS_BOOK_OBJ.wantToRead.icon}
				/>
				<span className='text-status'>
					{currentStatus ? STATUS_BOOK_OBJ[currentStatus].name : STATUS_BOOK_OBJ.wantToRead.name}
				</span>
				<DropdownGroupWhite />
			</button>
			{!_.isEmpty(userInfo) ? (
				<>
					{!inCreatePost && (
						<Modal
							id='status-book-modal'
							className='status-book-modal'
							show={modalShow}
							onHide={handleClose}
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
					)}
				</>
			) : (
				<ModalCheckLogin modalShow={modalShow} setModalShow={setModalShow} />
			)}
		</>
	);
};

StatusButton.defaultProps = {
	className: '',
	bookData: {},
	inCreatePost: false,
	bookStatus: '',
};

StatusButton.propTypes = {
	className: PropTypes.string,
	bookData: PropTypes.object,
	inCreatePost: PropTypes.bool,
	bookStatus: PropTypes.string,
};

export default StatusButton;
