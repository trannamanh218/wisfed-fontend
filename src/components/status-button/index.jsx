import classNames from 'classnames';
import { CircleCheckIcon, CoffeeCupIcon, TargetIcon } from 'components/svg';
import WrapIcon from 'components/wrap-icon';
import { STATUS_BOOK } from 'constants';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
	addBookToDefaultLibrary,
	addRemoveBookInLibraries,
	checkBookInLibraries,
	createLibrary,
	updateAuthLibrary,
} from 'reducers/redux-utils/library';
import './status-button.scss';
import StatusModalContainer from './StatusModalContainer';
import Circle from 'shared/loading/circle';
import { STATUS_LOADING, STATUS_IDLE } from 'constants';
import { updateCurrentBook } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import { STATUS_SUCCESS } from 'constants';
import { NotificationError } from 'helpers/Error';

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

const StatusButton = ({ className, status, bookData }) => {
	const [modalShow, setModalShow] = useState(false);
	const [currentStatus, setCurrentStatus] = useState(STATUS_BOOK_OBJ.wantToRead);
	const [bookLibraries, setBookLibaries] = useState([]);
	const [fetchStatus, setFetchStatus] = useState(STATUS_IDLE);
	const statusRef = useRef({});
	statusRef.current = STATUS_BOOK_OBJ.wantToRead;
	const navigate = useNavigate();

	const myCustomLibraries = useSelector(state => state.library.myAllLibrary).custom;
	const userInfo = useSelector(state => state.auth.userInfo);

	const dispatch = useDispatch();

	useEffect(() => {
		if (status) {
			setCurrentStatus(STATUS_BOOK_OBJ[status]);
			statusRef.current = STATUS_BOOK_OBJ[status];
		}
	}, [status]);

	const handleClose = () => {
		setModalShow(false);
	};

	const handleShow = e => {
		e.stopPropagation();
		// check duoc trang thai co trong thu vien
		let bookInLibraries = [];
		let initStatus = STATUS_BOOK_OBJ[status] || STATUS_BOOK_OBJ.wantToRead;
		dispatch(checkBookInLibraries(bookData.id || bookData.bookId))
			.unwrap()
			.then(res => {
				const { rows } = res;
				if (_.isEmpty(rows)) {
					bookInLibraries = myCustomLibraries.map(item => ({
						...item,
						isInLibrary: false,
						isSelect: false,
					}));
				} else {
					const currentLibraries = rows.map(item => ({ ...item.library }));
					bookInLibraries = myCustomLibraries.map(item => {
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
				setBookLibaries(bookInLibraries);
				setCurrentStatus(initStatus);
			})
			.catch(err => {
				NotificationError(err);
			})
			.finally(() => {
				setModalShow(true);
			});
	};

	const updateBookShelve = async params => {
		try {
			const data = await dispatch(createLibrary(params)).unwrap();
			const newRows = [...myCustomLibraries, data];
			dispatch(updateAuthLibrary({ rows: newRows, count: newRows.length }));
			const newBookLibraries = [...bookLibraries, { ...data, isInLibrary: false, isSelect: false }];
			setBookLibaries(newBookLibraries);
		} catch (err) {
			NotificationError(err);
			toast.error('Lỗi không tạo được tủ sách!');
		}
	};

	const updateStatusBook = () => {
		if (!_.isEmpty(bookData) && status !== currentStatus.value) {
			const params = { bookId: bookData.id || bookData.bookId, type: currentStatus.value };
			dispatch(addBookToDefaultLibrary(params)).unwrap();
		}
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
				return dispatch(addRemoveBookInLibraries({ id: bookData.id || bookData.bookId, ...data }));
			}
		}
	};

	const handleConfirm = async () => {
		setFetchStatus(STATUS_LOADING);
		try {
			await updateStatusBook();
			await handleAddAndRemoveBook();
			setModalShow(false);
			setFetchStatus(STATUS_SUCCESS);

			if (userInfo.id === bookData.actorCreatedPost) {
				if (status !== currentStatus.value) {
					dispatch(updateCurrentBook({ ...bookData, status: currentStatus.value }));
					navigate('/');
				}
			} else {
				dispatch(updateCurrentBook({ ...bookData, status: currentStatus.value }));
				navigate('/');
			}
		} catch (err) {
			NotificationError(err);
			setModalShow(false);
			setFetchStatus(STATUS_IDLE);
		}
	};

	const handleChangeStatus = data => {
		setCurrentStatus(data);
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
					component={status ? STATUS_BOOK_OBJ[status].icon : STATUS_BOOK_OBJ.wantToRead.icon}
				/>
				<span>{status ? STATUS_BOOK_OBJ[status].name : STATUS_BOOK_OBJ.wantToRead.name}</span>
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
							bookShelves={bookLibraries}
							updateBookShelve={updateBookShelve}
							handleConfirm={handleConfirm}
							onChangeShelves={onChangeShelves}
						/>
					</Modal.Body>
				</Modal>
			) : (
				<Modal
					id='status-book-modal'
					className='status-book-modal'
					show={modalShow}
					onHide={handleClose}
					keyboard={false}
					centered
				>
					<Modal.Body>Vui lòng đăng nhập để trải nghiệm</Modal.Body>
				</Modal>
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
	status: PropTypes.oneOf([STATUS_BOOK.read, STATUS_BOOK.reading, STATUS_BOOK.wantToRead]),
	handleClick: PropTypes.func,
	bookData: PropTypes.object,
};

export default StatusButton;
