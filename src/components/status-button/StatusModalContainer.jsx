import React, { useState } from 'react';
import AddBookShelveForm from './components/add-book-shelve-form/AddBookShelveForm';
import BookShelvesList from './components/book-shelves-list/BookShelvesList';
import StatusBookList from './components/status-book/StatusBookList';
import PropTypes from 'prop-types';

const StatusModalContainer = ({
	currentStatus,
	handleChangeStatus,
	bookShelves,
	updateBookShelve,
	setBookShelves,
	handleConfirm,
}) => {
	const [showInput, setShowInput] = useState(false);
	const addBookShelves = () => {
		if (!showInput) {
			setShowInput(true);
		}
	};

	return (
		<>
			<StatusBookList currentStatus={currentStatus} handleChangeStatus={handleChangeStatus} />
			<BookShelvesList list={bookShelves} />
			<AddBookShelveForm
				showInput={showInput}
				updateBookShelve={updateBookShelve}
				addBookShelves={addBookShelves}
				setBookShelves={setBookShelves}
				setShowInput={setShowInput}
			/>
			<button className='status-book-modal__confirm btn btn-primary' onClick={handleConfirm}>
				Xác nhận
			</button>
		</>
	);
};

StatusModalContainer.defaultProps = {
	bookShelves: [],
	currentStatus: {},
};

StatusModalContainer.propTypes = {
	currentStatus: PropTypes.object,
	handleChangeStatus: PropTypes.func,
	bookShelves: PropTypes.array,
	updateBookShelve: PropTypes.func,
	setBookShelves: PropTypes.func,
	handleConfirm: PropTypes.func,
};

export default StatusModalContainer;
