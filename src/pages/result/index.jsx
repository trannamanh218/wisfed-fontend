import NormalContainer from 'components/layout/normal-container';
import './result.scss';
import SearchButton from 'shared/search-button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BookSearch from './component/books-search';
import QuoteSearch from './component/quotes-search';
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
	const { saveValueInput, isShowModal } = useSelector(state => state.search);
	const [activeKeyDefault, setActiveKeyDefault] = useState('books');
	const [searchResultInput, setSearchResultInput] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const [listArrayBooks, setListArrayBooks] = useState([]);
	const [listArrayQuotes, setListArrayQuotes] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [reload, setReload] = useState(false);
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);
	const navigate = useNavigate();

	const handleSelecActiveKey = () => {
		if (saveValueInput.length > 0 && isShowModal === true) {
			setActiveKeyDefault('books');
		}
	};

	useEffect(() => {
		handleSelecActiveKey();
	}, [saveValueInput, isShowModal]);

	const handleChange = e => {
		setSearchResultInput(e.target.value);
	};

	const handleDirectParam = () => {
		if (searchResultInput) {
			navigate(`/result/q=${searchResultInput}`);
			callApiStart.current = 0;
			setListArrayBooks([]);
			setHasMore(true);
		}
	};

	const handleClickSearch = () => {
		handleDirectParam();
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			handleDirectParam();
		}
	};

	useEffect(() => {
		if (saveValueInput !== searchResultInput && listArrayBooks.length === 0) {
			handleGetBooksSearch();
		}
	}, [listArrayBooks]);

	useEffect(() => {
		if (!reload) {
			setReload(true);
		}
		setSearchResultInput(value);
	}, [value]);

	useEffect(() => {
		handleGetBooksSearch();
	}, [activeKeyDefault, value, reload]);

	const handleGetBooksSearch = async () => {
		setIsFetching(true);
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};

			if (Storage.getAccessToken()) {
				if ((_.isEmpty(listArrayBooks) || _.isEmpty(listArrayQuotes)) && searchResultInput.length > 0) {
					if (activeKeyDefault === 'books') {
						const resultBooks = await dispatch(getFilterSearchAuth(params)).unwrap();
						if (resultBooks.length > 0) {
							callApiStart.current += callApiPerPage.current;
							setListArrayBooks(listArrayBooks.concat(resultBooks));
						} else if (resultBooks.length === 0) {
							setHasMore(false);
						}
					} else if (activeKeyDefault === 'quotes') {
						const resultBooks = await dispatch(getFilterSearchAuth(params));
						setListArrayQuotes(resultBooks.resultBooks.data.rows);
					}
				}
			} else {
				if ((_.isEmpty(listArrayBooks) || _.isEmpty(listArrayQuotes)) && searchResultInput.length > 0) {
					if (activeKeyDefault === 'books') {
						const resultBooks = await dispatch(getFilterSearch(params)).unwrap();
						if (resultBooks.rows.length > 0) {
							callApiStart.current += callApiPerPage.current;
							setListArrayBooks(listArrayBooks.concat(resultBooks.rows));
						} else if (resultBooks.rows.length === 0) {
							setHasMore(false);
						}
					} else if (activeKeyDefault === 'quotes') {
						const resultBooks = await dispatch(getFilterSearch(params)).unwrap();
						setListArrayQuotes(resultBooks.resultBooks.data.rows);
					}
				}
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<NormalContainer>
			{isFetching ? <Circle loading={isFetching} /> : ''}
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
						onSelect={eventKey => setActiveKeyDefault(eventKey)}
					>
						<Tab eventKey='books' title='Sách'>
							<BookSearch
								listArrayBooks={listArrayBooks}
								hasMore={hasMore}
								handleGetBooksSearch={handleGetBooksSearch}
								isFetching={isFetching}
							/>
						</Tab>
						<Tab eventKey='group' title='Nhóm'>
							Group
						</Tab>
						<Tab eventKey='quotes' title='Quotes'>
							<QuoteSearch listArrayQuotes={listArrayQuotes} />
						</Tab>
						<Tab eventKey='everyone' title='Mọi người'>
							Mọi người
						</Tab>
						<Tab eventKey='story' title='Câu chuyện'>
							Câu chuyện
						</Tab>
					</Tabs>
				</div>
			</div>
		</NormalContainer>
	);
};

export default Result;
