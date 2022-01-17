import React from 'react';
import SearchIcon from 'assets/icons/search.svg';
import PropsTypes from 'prop-types';
import './search-field.scss';

const SearchField = ({ placeholder = 'Nhập thông tin tìm kiếm...', handleChange }) => {
	return (
		<div className='search-field'>
			<img className='search-field__icon' src={SearchIcon} alt='search-icon' />
			<input className='search-field__input' placeholder={placeholder} onChange={handleChange} />
		</div>
	);
};

SearchField.propTypes = {
	placeholder: PropsTypes.string,
	handleChange: PropsTypes.func,
};

export default SearchField;
