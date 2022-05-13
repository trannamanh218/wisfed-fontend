import PropTypes from 'prop-types';
import Shelf from 'shared/shelf';
import lookupBackground from 'assets/images/lookup-bg.png';
import './main-shelves.scss';

const SearchBook = props => {
	const { list, inputSearch, isMyShelve } = props;

	if (list && list.length) {
		return (
			<div className='main-shelves__search__results'>
				<h4>{`Kết quả tìm kiếm "${inputSearch}"`}</h4>
				<Shelf list={list} isMyShelve={isMyShelve} />
			</div>
		);
	}

	return (
		<div className='main-shelves__search__results'>
			<h4>{`Không có kết quả phù hợp với "${inputSearch}"`}</h4>
			<img className='main-shelves__search__img' src={lookupBackground} alt='search' />
			<p className='main-shelves__search__message'>Vui lòng tìm kiếm kết quả khác</p>
		</div>
	);
};

SearchBook.defaultProps = {
	list: [],
	inputSearch: '',
	isMyShelve: false,
};

SearchBook.propTypes = {
	list: PropTypes.array,
	inputSearch: PropTypes.string,
	isMyShelve: PropTypes.bool,
};

export default SearchBook;
