import NormalContainer from 'components/layout/normal-container';
import './result.scss';
import SearchButton from 'shared/search-button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BookSearch from './component/books-search';
import QuoteSearch from './component/quotes-search';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef, useCallback } from 'react';
import _ from 'lodash';
import Circle from 'shared/loading/circle';
import { useParams } from 'react-router-dom';
import { getFilterSearchAuth } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import { useNavigate } from 'react-router-dom';

const Result = () => {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const { innerHeight: height } = window;
	const { saveValueInput, isShowModal } = useSelector(state => state.search);
	const [activeKeyDefault, setActiveKeyDefault] = useState('books');
	const [searchResultInput, setSearchResultInput] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const [listArrayBooks, setListArrayBooks] = useState([]);
	const [listArrayQuotes, setListArrayQuotes] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [filter, setFilter] = useState('[]');
	const [newListInfiniteBooks, setNewListInfiniteBooks] = useState([]);
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(100);
	const elementRef = useRef();
	const navigate = useNavigate();

	const handleSelecActiveKey = () => {
		if (saveValueInput.length > 0 && isShowModal === true) {
			setActiveKeyDefault('everyone');
		}
	};

	useEffect(() => {
		handleSelecActiveKey();
	}, [saveValueInput, isShowModal]);

	const updateInputSearch = value => {
		if (value) {
			const filterValue = value;
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('[]');
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	const handleChange = e => {
		setSearchResultInput(e.target.value);
		debounceSearch(e.target.value);
	};

	const handleDirectParam = () => {
		if (searchResultInput) {
			navigate(`/result/${searchResultInput}`);
		}
	};

	const handleClickSearch = () => {
		handleGetBooksSearch();
		handleDirectParam();
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			handleGetBooksSearch();
			handleDirectParam();
		}
	};

	useEffect(() => {
		setSearchResultInput(slug);
		setFilter(JSON.stringify(slug));
	}, [slug]);

	useEffect(() => {
		handleGetBooksSearch();
	}, [activeKeyDefault, filter, callApiStart.current]);

	const handleScrol = () => {
		const list = elementRef.current;
		window.addEventListener('scroll', () => {
			if (~~(window.scrollY + height) === list?.clientHeight + list?.offsetTop) {
				callApiStart.current += 10;
				if (newListInfiniteBooks && newListInfiniteBooks.length > 0) {
					setListArrayBooks(listArrayBooks.concat(newListInfiniteBooks));
				} else {
					setHasMore(false);
				}
			}
		});
	};

	useEffect(() => {
		handleScrol();
	}, []);

	const handleGetBooksSearch = async () => {
		setIsFetching(true);
		try {
			if ((_.isEmpty(listArrayBooks) || _.isEmpty(listArrayQuotes)) && filter.length > 0 && searchResultInput) {
				const params = {
					q: filter,
					type: activeKeyDefault,
					start: callApiStart.current,
					limit: callApiPerPage.current,
				};
				if (activeKeyDefault === 'books') {
					const resultBooks = await dispatch(getFilterSearchAuth(params));
					const newListbook = resultBooks.payload.data;
					const newConcatArray = newListbook?.authors.concat(newListbook?.name);
					setNewListInfiniteBooks(newConcatArray);
				} else if (activeKeyDefault === 'quotes') {
					const resultBooks = await dispatch(getFilterSearchAuth(params));
					setListArrayQuotes(resultBooks.payload.data);
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
			<Circle loading={isFetching} />
			<div className='result__container'>
				<div className='result__header'>
					<div className='result__header__content'>Kết quả tìm kiếm cho {slug}</div>
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
								handleScrol={handleScrol}
								listArrayBooks={newListInfiniteBooks}
								hasMore={hasMore}
								elementRef={elementRef}
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
