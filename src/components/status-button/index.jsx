import { CircleCheckIcon, CoffeeCupIcon, TargetIcon } from 'components/svg';
import WrapIcon from 'components/wrap-icon';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import StatusModalContainer from './StatusModalContainer';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addBookToDefaultLibrary, createLibrary } from 'reducers/redux-utils/library';
import { toast } from 'react-toastify';
import { STATUS_BOOK } from 'constants';
import _ from 'lodash';
import './status-button.scss';

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

const StatusButton = ({ className, status, handleClick, libraryId, onChangeLibrary }) => {
	const [modalShow, setModalShow] = useState(false);
	const [currentStatus, setCurrentStatus] = useState(STATUS_BOOK_OBJ[status] || STATUS_BOOK_OBJ.wantToRead);
	const [showInput, setShowInput] = useState(false);

	const {
		library: { authLibraryData },
		book: { currentBook },
	} = useSelector(state => state);

	const dispatch = useDispatch();

	const handleClose = () => {
		setModalShow(false);
	};
	const handleShow = e => {
		e.stopPropagation();
		setModalShow(true);
	};

	const addBookShelves = () => {
		if (!showInput) {
			setShowInput(true);
		}
	};

	const updateBookShelve = async params => {
		try {
			await dispatch(createLibrary(params));
		} catch (err) {
			toast.error('Lỗi không tạo được tủ sách!');
		}
	};

	const updateStatusBook = async () => {
		if (!_.isEmpty(currentBook)) {
			try {
				const params = { bookId: currentBook.id, type: currentStatus.value };
				const data = await dispatch(addBookToDefaultLibrary(params)).unwrap();
			} catch (err) {
				// console.log(err);
			}
		}
	};

	const handleConfirm = () => {
		// setModalShow(false);
		// handleClick(currentStatus);
		updateStatusBook();
	};

	const handleChangeStatus = data => {
		setCurrentStatus(data);
	};

	return (
		<>
			<button
				className={classNames('btn btn-status btn-primary', { [`${className}`]: className })}
				data-testid='btn-modal'
				onClick={handleShow}
			>
				<WrapIcon className='btn-status__icon' component={currentStatus.icon} />
				<span>{currentStatus.name}</span>
			</button>
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
						bookShelves={authLibraryData.rows}
						updateBookShelve={updateBookShelve}
						addBookShelves={addBookShelves}
						handleConfirm={handleConfirm}
						onChangeLibrary={onChangeLibrary}
						libraryId={libraryId}
					/>
				</Modal.Body>
			</Modal>
		</>
	);
};

StatusButton.defaultProps = {
	className: '',
	status: STATUS_BOOK.wantToRead,
	handleClick: () => {},
	libraryId: null,
};

StatusButton.propTypes = {
	className: PropTypes.string,
	status: PropTypes.oneOf([STATUS_BOOK.read, STATUS_BOOK.reading, STATUS_BOOK.wantToRead]),
	handleClick: PropTypes.func,
	libraryId: PropTypes.any,
};

export default StatusButton;
