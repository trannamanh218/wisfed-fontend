import { CircleCheckIcon, CoffeeCupIcon, TargetIcon } from 'components/svg';
import WrapIcon from 'components/wrap-icon';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import StatusModalContainer from './StatusModalContainer';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import './status-button.scss';
import { useFetchLibraries } from 'api/library.hook';
const STATUS_BOOK = {
	'reading': {
		'title': 'Đang đọc',
		'value': 'reading',
		'icon': CoffeeCupIcon,
	},
	'read': {
		'title': 'Đã đọc',
		'value': 'read',
		'icon': CircleCheckIcon,
	},
	'wantRead': {
		'title': 'Muốn đọc',
		'value': 'wantRead',
		'icon': TargetIcon,
	},
};

const StatusButton = ({ className, status = 'wantRead' }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [modalShow, setModalShow] = useState(false);
	const [currentStatus, setCurrentStatus] = useState(STATUS_BOOK[status]);

	const filter = JSON.stringify([{ 'operator': 'eq', 'value': userInfo.id, 'property': 'createdBy' }]);
	const { libraryData } = useFetchLibraries(1, 10, filter);
	console.log(libraryData);

	const [bookShelves, setBookShelves] = useState([
		{
			title: 'Sách2021',
			id: 1,
		},
		{
			title: 'tusach1',
			id: 2,
		},
		{
			title: 'tusach2',
			id: 3,
		},
	]);

	const [showInput, setShowInput] = useState(false);

	const handleClose = () => setModalShow(false);
	const handleShow = () => setModalShow(true);

	const addBookShelves = () => {
		if (!showInput) {
			setShowInput(true);
		}
	};

	const updateBookShelve = title => {
		const id = Math.floor(Math.random() * 100000);
		const data = { title, id };
		setBookShelves(prev => [...prev, data]);
	};

	const handleConfirm = () => {
		setModalShow(false);
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
				<span>{currentStatus.title}</span>
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
						bookShelves={bookShelves}
						updateBookShelve={updateBookShelve}
						addBookShelves={addBookShelves}
						setBookShelves={setBookShelves}
						handleConfirm={handleConfirm}
					/>
				</Modal.Body>
			</Modal>
		</>
	);
};

StatusButton.propTypes = {
	className: PropTypes.string,
	status: PropTypes.oneOf(['read', 'reading', 'wantRead']),
};

export default StatusButton;
