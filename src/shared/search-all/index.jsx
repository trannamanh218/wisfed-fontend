import PropTypes from 'prop-types';
import './search-all.scss';
import ResultSearch from 'shared/results-search';
import { useState, useCallback, useEffect } from 'react';
import SearchField from 'shared/search-field';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFilterSearch, handleUpdateValueInputSearchRedux } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import { hashtagRegex } from 'constants';

const SearchAllModal = ({ showRef, setIsShow }) => {
	const [valueInputSearch, setValueInputSearch] = useState('');
	const [resultSearch, setResultSearch] = useState([]);
	const [filter, setFilter] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { valueInputSearchRedux } = useSelector(state => state.search);

	const updateInputSearch = value => {
		if (value) {
			const filterValue = value.toLowerCase().trim();
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('');
		}
	};

	useEffect(async () => {
		const params = {
			q: filter,
		};
		try {
			if (valueInputSearch.length > 0) {
				const result = await dispatch(getFilterSearch({ ...params })).unwrap();
				setResultSearch(result);
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [filter]);

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	const handleSearch = e => {
		debounceSearch(e.target.value);
		setValueInputSearch(e.target.value);
		// Lưu giá trị vào redux
		dispatch(handleUpdateValueInputSearchRedux(e.target.value));
	};

	useEffect(() => {
		// Điền vào ô search
		setValueInputSearch(valueInputSearchRedux);
	}, [valueInputSearchRedux]);

	const handleKeyDown = e => {
		const value = valueInputSearch?.trim();
		if (e.key === 'Enter' && value.length) {
			dispatch(handleUpdateValueInputSearchRedux(value));
			setIsShow(false);
			if (hashtagRegex.test(value)) {
				const formatedInpSearchValue = value
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/đ/g, 'd')
					.replace(/Đ/g, 'D')
					.replace(/#/g, '');
				navigate(`/hashtag/${formatedInpSearchValue}`);
			} else {
				navigate(`/result/q=${value}`);
			}
		}
	};

	return (
		<div ref={showRef} className='search__all__container'>
			<div className='search__all__header'>
				<SearchField
					placeholder='Tìm kiếm trên Wisfeed'
					handleChange={handleSearch}
					value={valueInputSearch}
					onKeyDown={handleKeyDown}
				/>
			</div>
			<ResultSearch setIsShow={setIsShow} valueInputSearch={valueInputSearch} resultSearch={resultSearch} />
		</div>
	);
};
SearchAllModal.propTypes = {
	showRef: PropTypes.object,
	setIsShow: PropTypes.func,
};
export default SearchAllModal;
