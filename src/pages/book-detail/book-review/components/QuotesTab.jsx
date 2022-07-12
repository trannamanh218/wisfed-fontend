import { useState, useEffect, useRef } from 'react';
import FilterPane from 'shared/filter-pane';
import FitlerOptions from 'shared/filter-options';
import QuoteCard from 'shared/quote-card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { getQuoteList, getQuotesByFriendsOrFollowers } from 'reducers/redux-utils/quote';
import LoadingIndicator from 'shared/loading-indicator';
import PropTypes from 'prop-types';
import './QuotesTab.scss';
import { Modal } from 'react-bootstrap';
import { useModal } from 'shared/hooks';
import FormCheckGroup from 'shared/form-check-group';
import Button from 'shared/button';

const QuotesTab = ({ currentTab }) => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'allQuotes' },
		{ id: 2, title: 'Bạn bè', value: 'friendsQuotes' },
		{ id: 3, title: 'Người theo dõi', value: 'followersQuotes' },
	];

	const radioOptions = [
		{
			value: 'mostLiked',
			title: 'Quote nhiều like nhất',
		},
		{
			value: 'lastest',
			title: 'Mới nhất',
		},
		{
			value: 'oldest',
			title: 'Cũ nhất',
		},
	];

	const handleChange = data => {
		setSortValue(data);
	};

	const [currentOption, setCurrentOption] = useState(filterOptions[0]);

	const [quoteList, setQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const { modalOpen, toggleModal } = useModal(false);
	const [sortValue, setSortValue] = useState('mostLiked');
	const [directionSort, setDirectionSort] = useState('DESC');
	const [propertySort, setPropertySort] = useState('like');

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();
	const { bookId } = useParams();

	useEffect(() => {
		if (currentTab === 'quotes') {
			setHasMore(true);
			callApiStart.current = 10;
			getQuoteListDataFirstTime();
		}
	}, [currentOption, currentTab, directionSort, propertySort]);

	const getQuoteListDataFirstTime = async () => {
		try {
			let params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: propertySort, direction: directionSort }]),
				filter: JSON.stringify([{ operator: 'eq', value: bookId, property: 'bookId' }]),
			};
			let quoteListData = [];

			if (currentOption.value === 'allQuotes') {
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else if (currentOption.value === 'friendsQuotes') {
				params = { ...params, type: 'friend' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			} else {
				params = { ...params, type: 'follow' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			}

			setQuoteList(quoteListData);
			if (quoteListData.length === 0 || quoteListData.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getQuoteListData = async () => {
		try {
			let params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: propertySort, direction: directionSort }]),
				filter: JSON.stringify([{ operator: 'eq', value: bookId, property: 'bookId' }]),
			};
			let quoteListData = [];

			if (currentOption.value === 'allQuotes') {
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else if (currentOption.value === 'friendsQuotes') {
				params = { ...params, type: 'friend' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			} else {
				params = { ...params, type: 'follow' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			}

			if (quoteListData.length) {
				callApiStart.current += callApiPerPage.current;
				setQuoteList(quoteList.concat(quoteListData));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleChangeOption = item => {
		setCurrentOption(item);
	};

	const onBtnConfirmClick = () => {
		switch (sortValue) {
			case 'oldest':
				setPropertySort('createdAt');
				setDirectionSort('ASC');
				break;
			case 'lastest':
				setPropertySort('createdAt');
				setDirectionSort('DESC');
				break;
			case 'mostLiked':
				setPropertySort('like');
				setDirectionSort('DESC');
				break;
			default:
			//
		}
	};

	return (
		<div className='quotes-tab'>
			<FilterPane title='Quotes' handleSortFilter={toggleModal}>
				<FitlerOptions
					list={filterOptions}
					currentOption={currentOption}
					handleChangeOption={handleChangeOption}
					name='filter-user'
					className='quotes-tab__filter__options'
				/>
				{currentTab === 'quotes' && quoteList.length > 0 ? (
					<InfiniteScroll
						dataLength={quoteList.length}
						next={getQuoteListData}
						hasMore={hasMore}
						loader={<LoadingIndicator />}
					>
						{quoteList.map(item => (
							<QuoteCard key={item.id} data={item} isDetail={false} />
						))}
					</InfiniteScroll>
				) : (
					<h5>Chưa có dữ liệu</h5>
				)}
			</FilterPane>

			<Modal className='sort-quotes-modal' show={modalOpen} onHide={toggleModal}>
				<Modal.Body>
					<div className='filter-quote-pane__setting__group'>
						<div className='sort-quotes-modal__item'>
							<span className='filter-quote-pane__setting__title'>Mặc định</span>
						</div>
						<div className='sort-quotes-modal__item'>
							<FormCheckGroup
								data={radioOptions[0]}
								name='custom'
								type='radio'
								defaultValue='default'
								handleChange={handleChange}
								checked={radioOptions[0].value === sortValue}
							/>
						</div>
						<div className='sort-quotes-modal__item'>
							<span className='filter-quote-pane__setting__title'>Theo thời gian tạo</span>
						</div>
						<div className='sort-quotes-modal__item'>
							<FormCheckGroup
								data={radioOptions[1]}
								name='custom'
								type='radio'
								defaultValue='default'
								handleChange={handleChange}
								checked={radioOptions[1].value === sortValue}
							/>
						</div>
						<div className='sort-quotes-modal__item'>
							<FormCheckGroup
								data={radioOptions[2]}
								name='custom'
								type='radio'
								defaultValue='default'
								handleChange={handleChange}
								checked={radioOptions[2].value === sortValue}
							/>
						</div>
						<div className='sort-quotes-modal__item' style={{ marginTop: '10px' }}>
							<Button
								className='btn'
								varient='primary'
								onClick={() => {
									onBtnConfirmClick(), toggleModal();
								}}
							>
								Xác nhận
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

QuotesTab.propTypes = {
	currentTab: PropTypes.string,
};

export default QuotesTab;
