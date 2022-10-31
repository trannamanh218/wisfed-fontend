import MyShelvesList from 'shared/my-shelves-list';
import StatisticList from 'shared/statistic-list';
import './sidebar-quote.scss';
import { useSelector } from 'react-redux';
import TopicColumn from 'shared/topic-column';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SearchField from 'shared/search-field';
import { useState, useEffect } from 'react';
import DualColumn from 'shared/dual-column';
import { getCountQuotesByCategory } from 'reducers/redux-utils/quote';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { handleCategoryByQuotesName } from 'reducers/redux-utils/quote';

const SidebarQuote = ({ listHashtags, inMyQuote, hasCountQuotes }) => {
	const [inputSearch, setInputSearch] = useState('');
	const [categoryList, setCategoryList] = useState([]);
	const [categorySearchedList, setCategorySearchedList] = useState([]);

	const { userId } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const myAllLibrary = useSelector(state => state.library.myAllLibrary);

	useEffect(() => {
		if (!inMyQuote && hasCountQuotes) {
			getCountQuotesByCategoryData();
		}
	}, []);

	const getCountQuotesByCategoryData = async () => {
		try {
			const params = { limit: 15, sort: JSON.stringify([{ property: 'countQuote', direction: 'DESC' }]) };
			const res = await dispatch(getCountQuotesByCategory({ userId: userId || '', params: params })).unwrap();
			setCategoryList(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleSearchCategories = e => {
		setInputSearch(e.target.value);
		const newArray = categoryList.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
		setCategorySearchedList(newArray);
	};

	const filterQuotesByCategory = (categoryId, categoryName) => {
		dispatch(handleCategoryByQuotesName(categoryName));
		navigate(`/quotes/category/${categoryId}`);
	};

	return (
		<div className='sidebar-quote'>
			<>
				{!inMyQuote && hasCountQuotes ? (
					<>
						{!!categoryList.length && (
							<div className='sidebar-quote__category-list'>
								<h4>Chủ đề Quotes</h4>
								<SearchField
									placeholder='Tìm kiếm danh mục'
									className='sidebar-quote__category-list__search'
									handleChange={handleSearchCategories}
									value={inputSearch}
								/>
								{inputSearch ? (
									<DualColumn
										list={categorySearchedList}
										pageText={true}
										inQuotes={true}
										filterQuotesByCategory={filterQuotesByCategory}
									/>
								) : (
									<DualColumn
										list={categoryList}
										pageText={true}
										inQuotes={true}
										filterQuotesByCategory={filterQuotesByCategory}
									/>
								)}
							</div>
						)}
					</>
				) : (
					<>
						{!!listHashtags.length && (
							<TopicColumn
								className='sidebar-category__topics'
								title='Hashtag từ Quotes'
								topics={listHashtags}
							/>
						)}
						{!_.isEmpty(myAllLibrary) && (
							<>
								<StatisticList
									className='sidebar-quote__reading__status'
									title='Trạng thái đọc'
									background='light'
									isBackground={true}
									list={myAllLibrary.default}
									pageText={false}
								/>
								<MyShelvesList list={myAllLibrary.custom} />
							</>
						)}
					</>
				)}
			</>
		</div>
	);
};

SidebarQuote.propTypes = {
	listHashtags: PropTypes.array,
	inMyQuote: PropTypes.bool,
	hasCountQuotes: PropTypes.bool,
};

export default SidebarQuote;
