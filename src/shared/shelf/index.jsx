import PropTypes from 'prop-types';
import BookItem from 'shared/book-item';
import './shelf.scss';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const Shelf = ({ list, isMyShelve, handleUpdateBookList, handleViewBookDetail }) => {
	const navigate = useNavigate();

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

	return (
		<div style={{ textAlign: 'center' }}>
			<p style={{ margin: '20px 0' }}>Bạn chưa có cuốn sách nào trong tủ, hãy thêm sách vào tủ nhé</p>
			<button onClick={() => navigate('/category')} className='btn btn-primary'>
				Thêm sách
			</button>
		</div>
	);
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
