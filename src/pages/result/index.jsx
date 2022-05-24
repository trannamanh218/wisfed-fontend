import NormalContainer from 'components/layout/normal-container';
import './result.scss';
import SearchButton from 'shared/search-button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BookSearch from './component/books-search';
import QuoteSearch from './component/quotes-search';
import GroupSearch from './component/group-search';
import AuthorSearch from './component/authors-search';
import UsersSearch from './component/users-search';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import Circle from 'shared/loading/circle';
import { useParams } from 'react-router-dom';
import { getFilterSearchAuth, getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import { useNavigate } from 'react-router-dom';
import Storage from 'helpers/Storage';

const Result = () => {
	const { value } = useParams();
	const dispatch = useDispatch();
	const { saveValueInput } = useSelector(state => state.search);
	const [activeKeyDefault, setActiveKeyDefault] = useState('authors');
	const [searchResultInput, setSearchResultInput] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const [listArrayBooks, setListArrayBooks] = useState([]);
	const [listArrayQuotes, setListArrayQuotes] = useState([]);
	const [listArrayGroup, setListArrayGroup] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [reload, setReload] = useState(false);
	const [count, setCount] = useState(0);
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);
	const navigate = useNavigate();

	const handleChange = e => {
		setSearchResultInput(e.target.value);
	};

	const handleDirectParam = () => {
		if (searchResultInput) {
			navigate(`/result/q=${searchResultInput}`);
			callApiStart.current = 0;
			setListArrayBooks([]);
			setListArrayQuotes([]);
			setHasMore(true);
		}
	};

	const handleClickSearch = () => {
		handleDirectParam();
	};

	const handleSelectKey = eventKey => {
		callApiStart.current = 0;
		setActiveKeyDefault(eventKey);
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			handleDirectParam();
		}
	};

	useEffect(() => {
		if (
			saveValueInput !== searchResultInput &&
			callApiStart.current === 0 &&
			(listArrayBooks.length === 0) | (listArrayQuotes.length === 0)
		) {
			handleGetBooksSearch();
		}
	}, [listArrayBooks, listArrayQuotes]);

	useEffect(() => {
		if (!reload) {
			setReload(true);
		}
		setSearchResultInput(value);
	}, [value]);

	useEffect(() => {
		handleGetBooksSearch();
	}, [activeKeyDefault, value, reload]);

	const handleCallAPI = async params => {
		if ((_.isEmpty(listArrayBooks) || _.isEmpty(listArrayQuotes)) && searchResultInput.length > 0) {
			if (activeKeyDefault === 'books') {
				const result = await dispatch(getAuthAPI(params)).unwrap();
				setCount(result.count);
				if (result.rows.length > 0) {
					callApiStart.current += callApiPerPage.current;
					setListArrayBooks(listArrayBooks.concat(result.rows));
				} else if (result.rows.length === 0) {
					setHasMore(false);
				}
			} else if (activeKeyDefault === 'quotes') {
				const result = await dispatch(getAuthAPI(params)).unwrap();
				if (result.rows.length > 0) {
					callApiStart.current += callApiPerPage.current;
					setListArrayQuotes(listArrayQuotes.concat(result.rows));
				} else if (result.rows.length === 0) {
					setHasMore(false);
				}
			} else if (activeKeyDefault === 'groups') {
				const result = await dispatch(getAuthAPI(params)).unwrap();
				if (result.rows.length > 0) {
					callApiStart.current += callApiPerPage.current;
					setListArrayGroup(listArrayGroup.concat(result.rows));
				} else if (result.rows.length === 0) {
					setHasMore(false);
				}
			}
		}
	};

	const handleGetBooksSearch = () => {
		setIsFetching(true);
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};
			let getAuthAPI;
			if (Storage.getAccessToken()) {
				getAuthAPI = getFilterSearchAuth;
				handleCallAPI(params,getAuthAPI);
			} else {
				getAuthAPI = getFilterSearch;
				handleCallAPI(params,getAuthAPI);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<NormalContainer>
			<Circle loading={isFetching} />
			<div className='result__container'>
				<div className='result__header'>
					<div className='result__header__content'>Kết quả tìm kiếm cho {value}</div>
				</div>
				<div className='result__search'>
					<div className='friends__header'>
						<SearchButton
							handleChange={handleChange}
							value={searchResultInput}
							handleClickSearch={handleClickSearch}
							onKeyDown={handleKeyDown}
						/>
					</div>
				</div>
				<div className='result__main'>
					<Tabs
						defaultActiveKey={'books'}
						activeKey={activeKeyDefault}
						onSelect={eventKey => handleSelectKey(eventKey)}
					>
						<Tab eventKey='books' title='Sách'>
							<BookSearch
								listArrayBooks={listArrayBooks}
								hasMore={hasMore}
								handleGetBooksSearch={handleGetBooksSearch}
								isFetching={isFetching}
								count={count}
							/>
						</Tab>
						<Tab eventKey='authors' title='Tác giả'>
							<AuthorSearch />
						</Tab>
						<Tab eventKey='users' title='Mọi người'>
							<UsersSearch />
						</Tab>
						<Tab eventKey='categories' title='Chủ đề'>
							Chủ đề
						</Tab>
						<Tab eventKey='quotes' title='Quotes'>
							<QuoteSearch
								isFetching={isFetching}
								listArrayQuotes={listArrayQuotes}
								hasMore={hasMore}
								handleGetBooksSearch={handleGetBooksSearch}
							/>
						</Tab>
						<Tab eventKey='groups' title='Nhóm'>
							<GroupSearch
								isFetching={isFetching}
								listArrayGroup={listArrayGroup}
								hasMore={hasMore}
								handleGetBooksSearch={handleGetBooksSearch}
							/>
						</Tab>
					</Tabs>
				</div>
			</div>
		</NormalContainer>
	);
};

export defaul