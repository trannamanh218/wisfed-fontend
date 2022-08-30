import SearchField from 'shared/search-field';
import Button from 'shared/button';
import './search-button.scss';
import PropTypes from 'prop-types';

const SearchButton = ({ handleChange, value, handleClickSearch, onKeyDown }) => {
	return (
		<div className='search__container'>
			<SearchField
				placeholder='Tìm kiếm trên wisfeed'
				handleChange={handleChange}
				value={value}
				onKeyDown={onKeyDown}
			/>
			<Button onClick={handleClickSearch} className='connect-button' isOutline={false} name='search'>
				<span>Tìm kiếm</span>
			</Button>
		</div>
	);
};

SearchButton.propTypes = {
	handleChange: PropTypes.func,
	value: PropTypes.string,
	handleClickSearch: PropTypes.func,
	onKeyDown: PropTypes.func,
};

export default SearchButton;
