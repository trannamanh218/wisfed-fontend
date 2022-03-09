import React from 'react';
import PropTypes from 'prop-types';
import Shelf from 'shared/shelf';
import lookupBackground from 'assets/images/lookup-bg.png';
import './main-shelves.scss';

const SearchBook = props => {
	const list = props;

	if (list && list.length) {
		<div className='main-shelves__search__results'>
			<h4>{`Kết quả tìm kiếm "Đắc nhân tâm"`}</h4>
			<Shelf list={list} />;
		</div>;
	}
	return (
		<div className='main-shelves__search__results'>
			<h4>{`Không có kết quả phù hợp với "Đắc nhân tâm"`}</h4>
			<img className='main-shelves__search__img' src={lookupBackground} alt='search' />
			<p className='main-shelves__search__message'>Vui lòng tìm kiếm kết quả khác</p>
		</div>
	);
};

SearchBook.defaultProps = {
	list: [],
};

SearchBook.propTypes = {
	list: PropTypes.array,
};

export default SearchBook;
