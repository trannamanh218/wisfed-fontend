import './top-books.scss';
import SelectBox from 'shared/select-box';
import { useRef, useEffect, useState } from 'react';
import AuthorBook from 'shared/author-book';
import StarRanking from 'shared/starRanks';
import PropTypes from 'prop-types';
import { getTopBooks } from 'reducers/redux-utils/ranks';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import ModalCheckLogin from 'shared/modal-check-login';
import LoadingIndicator from 'shared/loading-indicator';
import ModalSearchCategories from '../modal-search-categories/ModalSearchCategories';
import dropdownIcon from 'assets/images/dropdown.png';
import InfiniteScroll from 'react-infinite-scroll-component';

const TopBooks = ({ listYear, tabSelected }) => {
	const kindOfGroupRef = useRef({ value: 'default', title: 'Chủ đề' });
	const listYearRef = useRef({ value: 'default', title: 'Tuần' });
	const { isAuth } = useSelector(state => state.auth);
	const [topBooksId, setTopBooksId] = useState(null);
	const [valueDate, setValueData] = useState('week');
	const [topBooksList, setTopBooksList] = useState([]);
	const [modalShow, setModalShow] = useState(false);
	const [loadingState, setLoadingState] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);
	const limit = 90;

	const [modalSearchCategoriesShow, setModalSearchCategoriesShow] = useState(false);

	const dispatch = useDispatch();

	const category = JSON.parse(localStorage.getItem('category'));

	useEffect(() => {
		if (category) {
			kindOfGroupRef.current = { value: category.value, title: category.title };
			setTopBooksId(category.value);
			getTopBooksDataWhenAccessFromCategory(category);
			localStorage.removeItem('category');
		}
	}, []);

	useEffect(() => {
		if (tabSelected === 'books' && !category) {
			window.scrollTo(0, 0);
			setHasMore(true);
			callApiStart.current = 10;
			getTopBooksDataFirstTime();
		}
	}, [topBooksId, valueDate, isAuth, tabSelected]);

	const getTopBooksDataFirstTime = async () => {
		setLoadingState(true);
		const params = {
			start: 0,
			limit: callApiPerPage.current,
			categoryId: topBooksId,
			by: valueDate,
		};
		try {
			const topBooks = await dispatch(getTopBooks(params)).unwrap();
			setTopBooksList(topBooks);
			if (topBooks.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoadingState(false);
		}
	};

	const getTopBooksDataNext = async () => {
		const params = {
			start: callApiStart.current,
			limit: callApiPerPage.current,
			categoryId: topBooksId,
			by: valueDate,
		};
		try {
			const topBooks = await dispatch(getTopBooks(params)).unwrap();
			setTopBooksList(topBooksList.concat(topBooks));
			callApiStart.current += callApiPerPage.current;
			if (callApiStart.current === limit || topBooks.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getTopBooksDataWhenAccessFromCategory = async paramsLocalStorage => {
		setLoadingState(true);
		const params = {
			categoryId: paramsLocalStorage.value,
			by: valueDate,
		};
		try {
			const topBooks = await dispatch(getTopBooks(params)).unwrap();
			setTopBooksList(topBooks);
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoadingState(false);
		}
	};

	const onchangeKindOfDate = data => {
		listYearRef.current = data;
		setValueData(data.value);
	};

	const onchangeKindOfGroup = data => {
		kindOfGroupRef.current = data;
		setTopBooksId(data.id);
	};

	return (
		<div className='topbooks__container'>
			<ModalCheckLogin setModalShow={setModalShow} modalShow={modalShow} />
			{modalSearchCategoriesShow && (
				<ModalSearchCategories
					setModalSearchCategoriesShow={setModalSearchCategoriesShow}
					modalSearchCategoriesShow={modalSearchCategoriesShow}
					onSelectCategory={onchangeKindOfGroup}
					setTopBooksId={setTopBooksId}
					tabSelected={tabSelected}
				/>
			)}
			<div className='topbooks__container__title'>TOP 100 Cuốn sách tốt nhất</div>
			<div className='topbooks__container__sort'>
				<div className='topbooks__container__sort__left' onClick={() => setModalSearchCategoriesShow(true)}>
					<div className='select-box'>
						<div className='select-box__btn'>
							<span className='select-box__value'>
								{kindOfGroupRef.current.title || kindOfGroupRef.current.name || 'Chủ đề'}
							</span>
							<img className='select-box__icon' src={dropdownIcon} alt='dropdown' />
						</div>
					</div>
				</div>

				<div className='topbooks__container__sort__right'>
					<div className='topbooks__container__sort__right__title'>Xếp theo</div>
					<SelectBox
						name='themeGroup'
						list={listYear}
						defaultOption={listYearRef.current}
						onChangeOption={onchangeKindOfDate}
					/>
				</div>
			</div>
			{loadingState ? (
				<LoadingIndicator />
			) : (
				<>
					{topBooksList.length > 0 && tabSelected === 'books' ? (
						<InfiniteScroll
							dataLength={topBooksList.length}
							next={getTopBooksDataNext}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							<>
								{topBooksList.map((item, index) => (
									<div key={index} className='topbooks__container__main top__book'>
										<StarRanking index={index} />
										<div className='topbooks__container__main__layout'>
											<AuthorBook
												data={{ ...item.book, status: item.status }}
												checkStar={true}
												showShareBtn={true}
												setModalShow={setModalShow}
												valueDate={valueDate}
												topBooksId={topBooksId}
												categoryName={kindOfGroupRef.current.name}
												trueRank={index + 1}
											/>
										</div>
									</div>
								))}
							</>
						</InfiniteScroll>
					) : (
						<div className='topbooks__notthing'>Không có dữ liệu</div>
					)}
				</>
			)}
		</div>
	);
};
TopBooks.propTypes = {
	rows: PropTypes.array,
	listYear: PropTypes.array,
	tabSelected: PropTypes.string,
};
export default TopBooks;
