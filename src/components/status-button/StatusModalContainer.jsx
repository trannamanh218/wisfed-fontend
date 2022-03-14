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
	handleConfirm,
	onChangeLibrary,
	libraryId,
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
			<BookShelvesList list={bookShelves} onChangeLibrary={onChangeLibrary} libraryId={libraryId} />
			<AddBookShelveForm
				showInput={showInput}
				updateBookShelve={updateBookShelve}
				addBookShelves={addBookShelves}
				setShowInput={setShowInput}
			/>
			<button
				className='status-book-modal__confirm btn btn-primary'
				onClick={e => {
					e.preventDefault();
					e.stopPropagation();
					handleConfirm();
				}}
			>
				Xác nhận
			</button>
		</>
	);
};

StatusModalContainer.defaultProps = {
	currentStatus: {},
};

StatusModalContainer.propTypes = {
	currentStatus: PropTypes.object,
	handleChangeStatus: PropTypes.func,
	bookShelves: PropTypes.array,
	updateBookShelve: PropTypes.func,
	handleConfirm: PropTypes.func,
};

export default StatusModalContainer;
