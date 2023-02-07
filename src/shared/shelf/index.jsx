import PropTypes from 'prop-types';
import BookItem from 'shared/book-item';
import './shelf.scss';
import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Shelf = ({ list, isMyShelves, handleUpdateBookList, handleViewBookDetail, shelveGroupName }) => {
	const navigate = useNavigate();

	const { userId } = useParams();

	const userInfo = useSelector(state => state.auth.userInfo);

	if (list && list.length) {
		return (
			<div className='shelf'>
				{list.map(item => (
					<BookItem
						key={item.id}
						{...item}
						data={item}
						isMyShelves={isMyShelves}
						handleViewBookDetail={handleViewBookDetail}
						handleUpdateBookList={handleUpdateBookList}
					/>
				))}
			</div>
		);
	}

	return (
		<div style={{ textAlign: 'center' }}>
			<p style={{ margin: '20px 0' }}>
				{userInfo.id === userId ? 'Bạn' : shelveGroupName} chưa có cuốn sách nào
				{userInfo.id === userId && ', hãy thêm sách vào tủ nhé'}
			</p>
			{userInfo.id === userId && (
				<button onClick={() => navigate('/category')} className='btn btn-primary'>
					Thêm sách
				</button>
			)}
		</div>
	);
};

Shelf.defaultProps = {
	list: [],
	isMyShelves: false,
	handleViewBookDetail: () => {},
	handleUpdateBookList: () => {},
};

Shelf.propTypes = {
	list: PropTypes.array,
	isMyShelves: PropTypes.bool,
	handleUpdateBookList: PropTypes.func,
	handleViewBookDetail: PropTypes.func,
	shelveGroupName: PropTypes.string,
};

export default memo(Shelf);
