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
import { toast } from 'react-toastify';

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
	const [fetchStatus, setFetchStatus] = useState(false);
	const [customLibrariesContainCurrentBookId, setCustomLibrariesContainCurrentBookId] = useState([]);

	const addedArray = useRef([]);
	const removedArray = useRef([]);
	const initalStatus = useRef('');

	const navigate = useNavigate();
	const { userInfo } = useSelector(state => state.auth);
	const myCustomLibraries = useSelector(state => state.library.myAllLibrary).custom;
	const myAllLibraryReduxDefault = useSelector(state => state.library.myAllLibrary).default;

	const dispatch = useDispatch();

	useEffect(() => {
		if (Storage.getAccessToken()) {
			// Check cuốn sách hiện tại đang ở trong thư viện nào của ng dùng hay k
			if (myAllLibraryReduxDefault?.length) {
				let libraryContainCurrentBook = null;
				for (let i = 0; i < myAllLibraryReduxDefault.length; i++) {
					for (let j = 0; j < myAllLibraryReduxDefault[i].books.length; j++) {
						if (myAllLibraryReduxDefault[i].books[j].bookId === bookData.id) {
							libraryContainCurrentBook = myAllLibraryReduxDefault[i].defaultType;
							break;
						}
					}
				}
				setCurrentStatus(bookStatus);
				initalStatus.current = libraryContainCurrentBook;
			}
		} else {
			setCurrentStatus(STATUS_BOOK.wantToRead);
		}
	}, []);

	const handleClose = () => {
		setModalShow(false);
		if (initalStatus.current) {
			setCurrentStatus(initalStatus.current);
		} else {
			setCurrentStatus(bookStatus);
		}
	};

	const handleShow = async e => {
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
			setModalShow(true);
		}
	};

	const updateBookShelve = async params => {
		try {
			await dispatch(createLibrary(params)).unwrap();
			setTimeout(() => {
				dispatch(updateMyAllLibraryRedux());
			}, 200);
		} catch (err) {
			NotificationError(err);
		}
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
		if (!inCreatePost) {
			setFetchStatus(true);
			try {
				if (currentStatus !== initalStatus.current) {
					updateStatusBook();
					const customId = 'custom-id-status-button-success';
					toast.success('Chuyển giá sách thành công', { toastId: customId });
					initalStatus.current = currentStatus;
				}
				handleAddAndRemoveBook();
				dispatch(updateCurrentBook({ ...bookData, status: currentStatus }));
				setTimeout(() => {
					dispatch(updateMyAllLibraryRedux());
				}, 200);
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
					component={
						initalStatus.current
							? STATUS_BOOK_OBJ[initalStatus.current].icon
							: STATUS_BOOK_OBJ.wantToRead.icon
					}
				/>
				<span className='text-status'>
					{initalStatus.current
						? STATUS_BOOK_OBJ[initalStatus.current].name
						: STATUS_BOOK_OBJ.wantToRead.name}
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
