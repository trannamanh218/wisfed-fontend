import { CircleCheckIcon, CoffeeCupIcon, TargetIcon } from 'components/svg';
import WrapIcon from 'components/wrap-icon';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import StatusModalContainer from './StatusModalContainer';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchLibraries } from 'api/library.hook';
import './status-button.scss';
import { createLibrary } from 'reducers/redux-utils/library';
import { toast } from 'react-toastify';
import { STATUS_BOOK } from 'constants';

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
	'liked': {
		'name': 'Muốn đọc',
		'value': STATUS_BOOK.liked,
		'icon': TargetIcon,
	},
};

const StatusButton = ({ className, status, handleClick, libraryId, onChangeLibrary }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [modalShow, setModalShow] = useState(false);
	const [currentStatus, setCurrentStatus] = useState(STATUS_BOOK_OBJ[status]);

	const filter = JSON.stringify([{ 'operator': 'eq', 'value': userInfo.id, 'property': 'createdBy' }]);
	const { libraryData } = useFetchLibraries(1, 10, filter);
	const dispatch = useDispatch();

	const [showInput, setShowInput] = useState(false);

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

	const handleConfirm = () => {
		setModalShow(false);
		handleClick(currentStatus);
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
						bookShelves={libraryData.rows}
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
	status: STATUS_BOOK.liked,
	handleClick: () => {},
	libraryId: null,
};

StatusButton.propTypes = {
	className: PropTypes.string,
	status: PropTypes.oneOf([STATUS_BOOK.read, STATUS_BOOK.reading, STATUS_BOOK.liked]),
	handleClick: PropTypes.func,
	libraryId: PropTypes.any,
};

export default StatusButton;
