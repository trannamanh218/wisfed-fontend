import PropTypes from 'prop-types';
import BookItem from 'shared/book-item';
import './shelf.scss';

const Shelf = ({ list, isMyShelve, handleClick }) => {
	if (list && list.length) {
		return (
			<div className='shelf'>
				{list.map(item => (
					<BookItem key={item.id} {...item} data={item} isMyShelve={isMyShelve} handleClick={handleClick} />
				))}
			</div>
		);
	}

	return <p>Không có dữ liệu</p>;
};

Shelf.defaultProps = {
	list: [],
	isMyShelve: false,
	handleClick: () => {},
};

Shelf.propTypes = {
	list: PropTypes.array,
	isMyShelve: PropTypes.bool,
	handleClick: PropTypes.func,
};

export default Shelf;
