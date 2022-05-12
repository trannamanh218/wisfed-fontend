import PropTypes from 'prop-types';
import './search-all.scss';
import SearchIcon from 'assets/icons/search.svg';
import ResultSearch from 'shared/results-search';
import { BackArrow } from 'components/svg';
import { useState } from 'react';

const SearchAllModal = ({ showRef }) => {
	const [valueInputSearch, setValueInputSearch] = useState('Những cuốn sách hay');

	return (
		<div ref={showRef} className='search__all__container'>
			<div className='search__all__header'>
				<div className='header__search'>
					<img className='header__search__icon' src={SearchIcon} alt='search-icon' />
					<input className='header__search__input' autoFocus placeholder='Tìm kiếm trên Wisfeed' />
				</div>
				<div className='search__all__header__icon'>
					<BackArrow />
				</div>
			</div>
			<div className='search__all__main__title'>
				<div className='search__all__title'>Tìm kiếm gần đây </div>
				<div className='search__all__title__editing'>Chỉnh sửa</div>
			</div>
			<ResultSearch valueInputSearch={valueInputSearch} />
		</div>
	);
};
SearchAllModal.propTypes = {
	showRef: PropTypes.object,
};
export default SearchAllModal;
