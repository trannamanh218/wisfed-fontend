import { CircleCheckIcon } from 'components/svg';
import WrapIcon from 'components/wrap-icon';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import StatusModalContainer from './StatusModalContainer';
import './status-button.scss';

const StatusButton = () => {
	const [modalShow, setModalShow] = useState(false);
	const [currentStatus, setCurrentStatus] = useState({
		'title': 'Đã đọc',
		'value': 'readAlready',
		'icon': CircleCheckIcon,
	});

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
			<button className='btn btn-status btn-primary' data-testid='btn-modal' onClick={handleShow}>
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
					{/* <StatusButtonList currentStatus={currentStatus} handleChangeStatus={handleChangeStatus} />
					{bookShelves.length && <BookShelvesList list={bookShelves} />}
					<AddBookShelveForm
						showInput={showInput}
						updateBookShelve={updateBookShelve}
						addBookShelves={addBookShelves}
						setBookShelves={setBookShelves}
						setShowInput={setShowInput}
					/>
					<button className='status-book-modal__confirm btn btn-primary' onClick={handleConfirm}>
						Xác nhận
					</button> */}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default StatusButton;
