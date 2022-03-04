import React, { useRef } from 'react';
import SearchIcon from 'assets/icons/search.svg';
import PropTypes from 'prop-types';
import './search-field.scss';
import classNames from 'classnames';

const SearchField = ({ placeholder = 'Nhập thông tin tìm kiếm...', handleChange, className }) => {
	const inputRef = useRef();
	return (
		<div className={classNames('search-field', { [`${className}`]: className })}>
			<img className='search-field__icon' src={SearchIcon} alt='search-icon' />
			<input ref={inputRef} className='search-field__input' placeholder={placeholder} onChange={handleChange} />
		</div>
	);
};

SearchField.propTypes = {
	placeholder: PropTypes.string,
	handleChange: PropTypes.func,
	className: PropTypes.string,
};

export default SearchField;
