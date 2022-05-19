import PropTypes from 'prop-types';
import './search-all.scss';
import ResultSearch from 'shared/results-search';
import { useState, useCallback, useEffect } from 'react';
import SearchField from 'shared/search-field';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { handleSaveValueInput, handleResetValue } from 'reducers/redux-utils/search';
import { useDispatch, useSelector } from 'react-redux';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import Storage from 'helpers/Storage';

const SearchAllModal = ({ showRef }) => {
	const [valueInputSearch, setValueInputSearch] = useState('');
	const [resultSearch, setResultSearch] = useState([]);
	const [filter, setFilter] = useState('[]');
	const [valueInput, setValueInput] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { saveValueInput } = useSelector(state => state.search);

	const updateInputSearch = value => {
		if (value) {
			dispatch(handleSaveValueInput(value));
			const filterValue = value.toLowerCase().trim();
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('[]');
		}
	};

	useEffect(async () => {
		const params = {
			q: filter,
		};
		try {
			if (valueInputSearch.length > 0) {
				const result = await dispatch(getFilterSearch({ ...params })).unwrap();
				setResultSearch(result.data);
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [filter, valueInputSearch]);

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);
	const handleSearch = e => {
		setValueInputSearch(e.target.value);
		debounceSearch(e.target.value);
		setValueInput(e.target.value);
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			if (saveValueInput) {
				dispatch(handleResetValue(true));
				if (valueInput) {
					navigate(`/result/${valueInput}`);
				}
			}
		}
	};

	return (
		<div ref={showRef} className='search__all__container'>
			<div className='search__all__header'>
				<SearchField
					placeholder='Tìm kiếm wisfeed'
					handleChange={handleSearch}
					value={valueInputSearch}
					onKeyDown={handleKeyDown}
				/>
			</div>
			<ResultSearch valueInputSearch={valueInputSearch} resultSearch={resultSearch} />
		</div>
	);
};
SearchAllModal.propTypes = {
	showRef: PropTypes.object,
};
export default SearchAllModal;
