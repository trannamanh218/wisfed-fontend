import SelectBox from 'shared/select-box';
import { useRef, useEffect, useState } from 'react';
import StarRanking from 'shared/starRanks';
import TopQuotesComponent from 'shared/top-quotes';
import { getTopQuotes } from 'reducers/redux-utils/ranks';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import ModalSearchCategories from '../modal-search-categories/ModalSearchCategories';
import dropdownIcon from 'assets/images/dropdown.png';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';

const TopQuotes = ({ listYear, tabSelected }) => {
	const [topQuotesId, setTopQuotesId] = useState(null);
	const [valueDate, setValueData] = useState('week');
	const [topQuotesList, setTopQuotesList] = useState([]);
	const [modalSearchCategoriesShow, setModalSearchCategoriesShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);
	const kindOfGroupRef = useRef({ value: 'default', title: 'Chủ đề' });
	const listYearRef = useRef({ value: 'default', title: 'Tuần' });

	const dispatch = useDispatch();

	useEffect(() => {
		if (tabSelected === 'quotes') {
			window.scrollTo(0, 0);
			callApiStart.current = callApiPerPage.current;
			setHasMore(true);
			getTopQuotesDataFirstTime();
		}
	}, [topQuotesId, valueDate, tabSelected]);

	const getTopQuotesDataFirstTime = async () => {
		setLoading(true);
		const params = {
			start: 0,
			limit: callApiPerPage.current,
			categoryId: topQuotesId,
			by: valueDate,
		};
		try {
			const topQuotes = await dispatch(getTopQuotes(params)).unwrap();
			setTopQuotesList(topQuotes.rows);
			if (topQuotes.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoading(false);
		}
	};

	const getTopQuotesData = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				categoryId: topQuotesId,
				by: valueDate,
			};

			const topQuotes = await dispatch(getTopQuotes(params)).unwrap();
			setTopQuotesList(topQuotesList.concat(topQuotes.rows));
			callApiStart.current += callApiPerPage.current;
			if (topQuotes.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const onchangeKindOfGroup = data => {
		kindOfGroupRef.current = data;
		setTopQuotesId(data.id);
	};

	const onchangeKindOfDate = data => {
		listYearRef.current = data;
		setValueData(data.value);
	};

	return (
		<div className='topbooks__container'>
			{modalSearchCategoriesShow && (
				<ModalSearchCategories
					setModalSearchCategoriesShow={setModalSearchCategoriesShow}
					modalSearchCategoriesShow={modalSearchCategoriesShow}
					onSelectCategory={onchangeKindOfGroup}
					setTopQuotesId={setTopQuotesId}
					tabSelected={tabSelected}
				/>
			)}
			<div className='topbooks__container__title'>TOP 100 Quotes được like nhiều nhất</div>
			<div className='topbooks__container__sort'>
				<div className='topbooks__container__sort__left' onClick={() => setModalSearchCategoriesShow(true)}>
					<div className='select-box'>
						<div className='select-box__btn'>
							<span className='select-box__value'>{kindOfGroupRef.current.name || 'Chủ đề'}</span>
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
			{loading ? (
				<LoadingIndicator />
			) : (
				<>
					{topQuotesList.length > 0 ? (
						<InfiniteScroll
							dataLength={topQuotesList.length}
							next={getTopQuotesData}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							{topQuotesList.map((item, index) => (
								<div key={item.id} className='topbooks__container__main'>
									<StarRanking index={index} />
									<div className='topbooks__container__main__layout'>
										<TopQuotesComponent
											item={item}
											valueDate={valueDate}
											categoryItem={kindOfGroupRef.current}
											trueRank={index + 1}
										/>
									</div>
								</div>
							))}
						</InfiniteScroll>
					) : (
						<div className='topbooks__notthing'>Không có dữ liệu</div>
					)}
				</>
			)}
		</div>
	);
};

TopQuotes.propTypes = {
	rows: PropTypes.array,
	listYear: PropTypes.array,
	tabSelected: PropTypes.string,
};

export default TopQuotes;
