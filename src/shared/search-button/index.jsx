import SearchField from 'shared/search-field';
import Button from 'shared/button';
import './search-button.scss';
import PropTypes from 'prop-types';

const SearchButton = ({ handleChange, value }) => {
	return (
		<div className='search__container'>
			<SearchField placeholder='Tìm kiếm bạn bè' handleChange={handleChange} value={value} />
			<Button className='connect-button' isOutline={false} name='search'>
				<span>Tìm kiếm</span>
			</Button>
		</div>
	);
};
SearchButton.propTypes = {
	handleChange: PropTypes.func,
	value: PropTypes.string,
};
export default SearchButton;
