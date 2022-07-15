import classNames from 'classnames';
import { CircleCheckIcon, CoffeeCupIcon, TargetIcon, DropdownGroupWhite } from 'components/svg';
import WrapIcon from 'components/wrap-icon';
import { STATUS_BOOK } from 'constants';
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
import { STATUS_LOADING, STATUS_IDLE } from 'constants';
import { updateCurrentBook } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import { STATUS_SUCCESS } from 'constants';
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

const StatusButton = ({ className, bookData, inPostBook = false, hasBookStatus = false, postActor }) => {
	const [modalShow, setModalShow] = useState(false);
	const [currentStatus, setCurrentStatus] = useState('');
	const [fetchStatus, setFetchStatus] = useState(STATUS_IDLE);
	const [customLibrariesContainCurrentBookId, setCustomLibrariesContainCurrentBookId] = useState([]);
	const { userInfo } = useSelector(state => state.auth);
	const addedArray = useRef([]);
	const removedArray = useRef([]);

	const navigate = useNavigate();

	const myCustomLibraries = useSelector(state => state.library.myAllLibrary).custom;

	const dispatch = useDispatch();

	useEffect(async () => {
		if (Storage.getAccessToken()) {
			if (hasBookStatus) {
				if (inPostBook) {
					if (userInfo.id === postActor) {
						setCurrentStatus(bookData.status);
					} else {
						checkBookInDefaultLibrary();
					}
				} else {
					setCurrentStatus(bookData.status);
				}
			} else {
				checkBookInDefaultLibrary();
			}
		} else {
			setCurrentStatus(STATUS_BOOK.wantToRead);
		}
	}, []);

	const checkBookInDefaultLibrary = async () => {
		try {
			const res = await dispatch(checkBookInLibraries(bookData.id || bookData.bookId)).unwrap();
			const defaultLibraryContainCurrentBook = res.filter(item => item.library.isDefault === true);
			if (!!res.length && !!defaultLibraryContainCurrentBook.length) {
				setCurrentStatus(defaultLibraryContainCurrentBook[0].library.defaultType);
			} else {
				setCurrentStatus(STATUS_BOOK.wantToRead);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleClose = () => {
		setModalShow(false);
	};

	const handleShow = async e => {
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
	};

	const updateBookShelve = async params => {
		try {
			await dispatch(createLibrary(params)).unwrap();
			dispatch(updateMyAllLibraryRedux());
		} catch (err) {
			NotificationError(err);
		}
	};

	const updateStatusBook = () => {
		if (!_.isEmpty(bookData)) {
			const params = { bookId: bookData.id || bookData.bookId, type: currentStatus };
			dispatch(addBookToDefaultLibrary(params));
		}
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
		setFetchStatus(STATUS_LOADING);
		try {
			await updateStatusBook();
			await handleAddAndRemoveBook();
			setModalShow(false);
			setFetchStatus(STATUS_SUCCESS);
			dispatch(updateCurrentBook({ ...bookData, status: currentStatus }));
			navigate('/');
		} catch (err) {
			NotificationError(err);
			setModalShow(false);
			setFetchStatus(STATUS_IDLE);
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
			<Circle loading={fetchStatus === STATUS_LOADING} />
			<button
				className={classNames('btn btn-status btn-primary', { [`${className}`]: className })}
				data-testid='btn-modal'
				onClick={handleShow}
			>
				<WrapIcon
					className='btn-status__icon'
					component={currentStatus ? STATUS_BOOK_OBJ[currentStatus].icon : STATUS_BOOK_OBJ.wantToRead.icon}
				/>
				<span>{currentStatus ? STATUS_BOOK_OBJ[currentStatus].name : STATUS_BOOK_OBJ.wantToRead.name}</span>
				<DropdownGroupWhite />
			</button>
			{!_.isEmpty(userInfo) ? (
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
			) : (
				<ModalCheckLogin modalShow={modalShow} setModalShow={setModalShow} />
			)}
		</>
	);
};

StatusButton.defaultProps = {
	className: '',
	status: STATUS_BOOK.wantToRead,
	handleClick: () => {},
	bookData: {},
};

StatusButton.propTypes = {
	className: PropTypes.string,
	bookData: PropTypes.object,
	inPostBook: PropTypes.bool,
	hasBookStatus: PropTypes.bool,
	postActor: PropTypes.string,
};

export default StatusButton;
