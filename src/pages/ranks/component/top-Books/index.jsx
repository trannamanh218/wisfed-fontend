import './top-books.scss';
import SelectBox from 'shared/select-box';
import React, { useRef, useEffect, useState } from 'react';
import AuthorBook from 'shared/author-book';
import StarRanking from 'shared/starRanks';
import PropTypes from 'prop-types';
import { getTopBooks, getTopBooksAuth } from 'reducers/redux-utils/ranks';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import ModalCheckLogin from 'shared/modal-check-login';
import LoadingIndicator from 'shared/loading-indicator';

const TopBooks = ({ rows, listYear, tabSelected }) => {
	const kindOfGroupRef = useRef({ value: 'default', title: 'Chủ đề' });
	const listYearRef = useRef({ value: 'default', title: 'Tuần' });
	const { isAuth } = useSelector(state => state.auth);
	const [topBooksId, setTopQuotesId] = useState(null);
	const [valueDate, setValueData] = useState('week');
	const [getListTopBooks, setGetListTopBooks] = useState([]);
	const [modalShow, setModalShow] = useState(false);
	const [loadingState, setLoadingState] = useState(false);
	const dispatch = useDispatch();

	const onchangeKindOfGroup = data => {
		kindOfGroupRef.current = data;
		setTopQuotesId(data.id);
	};

	const getTopBooksData = async () => {
		setLoadingState(true);
		const params = {
			categoryId: topBooksId,
			by: valueDate,
		};
		try {
			if (isAuth === false) {
				const topBooks = await dispatch(getTopBooks(params)).unwrap();
				setGetListTopBooks(topBooks);
			} else if (isAuth === true) {
				const topBooks = await dispatch(getTopBooksAuth(params)).unwrap();
				setGetListTopBooks(topBooks);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoadingState(false);
		}
	};

	useEffect(() => {
		if (tabSelected === 'books') {
			getTopBooksData();
		}
	}, [topBooksId, valueDate, isAuth, tabSelected]);

	const onchangeKindOfDate = data => {
		window.scrollTo(0, 0);
		listYearRef.current = data;
		setValueData(data.value);
	};

	return (
		<div className='topbooks__container'>
			<ModalCheckLogin setModalShow={setModalShow} modalShow={modalShow} />
			<div className='topbooks__container__title'>TOP 100 Cuốn sách tốt nhất</div>
			<div className='topbooks__container__sort'>
				<div className='topbooks__container__sort__left'>
					<SelectBox
						name='themeGroup'
						list={rows}
						defaultOption={kindOfGroupRef.current}
						onChangeOption={onchangeKindOfGroup}
					/>
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
					{getListTopBooks.length > 0 ? (
						getListTopBooks.map((item, index) => (
							<div key={item.bookId} className='topbooks__container__main top__book'>
								<StarRanking index={index} />
								<div className='topbooks__container__main__layout'>
									<AuthorBook
										data={item}
										checkStar={true}
										showShareBtn={true}
										setModalShow={setModalShow}
										valueDate={valueDate}
										topBooksId={topBooksId}
										categoryName={kindOfGroupRef.current.name}
										position='topBook'
									/>
								</div>
							</div>
						))
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
