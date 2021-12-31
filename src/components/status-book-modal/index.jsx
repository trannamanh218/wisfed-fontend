import { CircleCheckIcon } from 'components/svg';
import { Form, Formik, Field } from 'formik';
import Validation from 'helpers/Validation';
import React, { useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import BookShelvesList from './components/BookShelvesList';
import StatusBookList from './components/StatusBookList';

import './status-book-modal.scss';

const StatusBookModal = () => {
	const [show, setShow] = useState(true);
	const [status, setStatus] = useState({
		'title': 'Đã đọc',
		'value': 'readAlready',
		'icon': CircleCheckIcon,
	});

	const inputRef = useRef(null);

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

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const addBookShelves = () => {
		if (!showInput) {
			setShowInput(true);
		}
	};

	const handleSubmit = values => {
		if (values.title) {
			const id = Math.floor(Math.random() * 100000);
			const newTitle = { ...values, id };
			setBookShelves(prev => [...prev, newTitle]);
		}

		setShowInput(false);
	};

	return (
		<>
			<button className='btn btn-status btn-primary' onClick={handleShow}>
				{status.title}
			</button>
			<Modal className='status-book-modal' show={show} onHide={handleClose} keyboard={false} centered>
				<Modal.Body>
					<StatusBookList />
					{bookShelves.length && <BookShelvesList list={bookShelves} />}
					{showInput && (
						<Formik
							initialValues={{
								title: '',
							}}
							validationSchema={Validation.titleBookShelve()}
							onSubmit={handleSubmit}
						>
							{({ errors, touched }) => (
								<Form
								//   onSubmit={handleSubmit}
								//   onKeyDown={(e) => {
								// 	if (e.key === 'Enter') {
								// 	  handleSubmit();
								// 	}
								//   }}
								>
									<Field
										name='title'
										className='status-book-modal__input'
										placeholder='Nhập để thêm giá sách'
										ref={inputRef}
									/>
									{errors.title && touched.title ? (
										<small className='error-message'>{errors.title}</small>
									) : null}
								</Form>
							)}
						</Formik>
					)}
					<button className='status-book-modal__addBtn' onClick={addBookShelves}>
						<span className='add-icon'>+</span>
						<span>Thêm giá sách</span>
					</button>
					<button className='status-book-modal__confirm btn btn-primary' type='submit'>
						Xác nhận
					</button>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default StatusBookModal;
