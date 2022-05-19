import { useState } from 'react';
import AddBookShelveForm from '../../components/status-button/components/add-book-shelve-form/AddBookShelveForm';
import BookShelvesList from '../../components/status-button/components/book-shelves-list/BookShelvesList';
import StatusBookList from '../../components/status-button/components/status-book/StatusBookList';
import PropTypes from 'prop-types';

const StatusModalContainer = ({
	currentStatus,
	handleChangeStatus,
	bookShelves,
	updateBookShelve,
	handleConfirm,
	onChangeShelves,
	customLibrariesContainCurrentBookId,
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
			<BookShelvesList
				list={bookShelves}
				onChangeShelves={onChangeShelves}
				customLibrariesContainCurrentBookId={customLibrariesContainCurrentBookId}
			/>
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
	currentStatus: 'wantToRead',
};

StatusModalContainer.propTypes = {
	currentStatus: PropTypes.string,
	handleChangeStatus: PropTypes.func,
	bookShelves: PropTypes.array,
	updateBookShelve: PropTypes.func,
	handleConfirm: PropTypes.func,
	onChangeShelves: PropTypes.func,
	customLibrariesContainCurrentBookId: PropTypes.array,
};

export default StatusModalContainer;
