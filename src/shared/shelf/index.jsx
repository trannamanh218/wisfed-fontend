import PropTypes from 'prop-types';
import BookItem from 'shared/book-item';
import './shelf.scss';
import { memo } from 'react';

const Shelf = ({ list, isMyShelve, handleUpdateBookList, handleViewBookDetail }) => {
	if (list && list.length) {
		return (
			<div className='shelf'>
				{list.map(item => (
					<BookItem
						key={item.id}
						{...item}
						data={item}
						isMyShelve={isMyShelve}
						handleViewBookDetail={handleViewBookDetail}
						handleUpdateBookList={handleUpdateBookList}
					/>
				))}
			</div>
		);
	}

	return <p>Không có dữ liệu</p>;
};

Shelf.defaultProps = {
	list: [],
	isMyShelve: false,
	handleViewBookDetail: () => {},
	handleUpdateBookList: () => {},
};

Shelf.propTypes = {
	list: PropTypes.array,
	isMyShelve: PropTypes.bool,
	handleUpdateBookList: PropTypes.func,
	handleViewBookDetail: PropTypes.func,
};

export default memo(Shelf);
