import { CircleCheckIcon } from 'components/svg';
import WrapIcon from 'components/wrap-icon';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import StatusModalContainer from './StatusModalContainer';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './status-button.scss';

const StatusButton = ({ className }) => {
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
};

export default StatusButton;
