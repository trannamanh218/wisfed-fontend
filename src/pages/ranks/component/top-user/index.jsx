import SelectBox from 'shared/select-box';
import React, { useRef, useEffect, useState } from 'react';
import AuthorCard from 'shared/author-card';
import StarRanking from 'shared/starRanks';
import './top-user.scss';
import { ShareRanks } from 'components/svg';
import TopRanks from 'shared/top-ranks';
import PropTypes from 'prop-types';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { getTopUser, getFilterTopUser } from 'reducers/redux-utils/ranks';

const TopUser = ({ rows, listYear }) => {
	const kindOfGroupRef = useRef({ value: 'default', title: 'Chủ đề' });
	const listYearRef = useRef({ value: 'default', title: 'Tuần' });
	const listRead = useRef({ value: 'default', title: 'Đọc nhiều nhất' });

	const [topUserFilter, setTopUserFilter] = useState();
	const [valueDate, setValueDate] = useState('week');
	const [valueDataSort, setValueDataSort] = useState();
	const [getListTopBooks, setGetListTopBooks] = useState([]);

	const dispatch = useDispatch();
	const listDataSortType = [
		{ value: 'week', title: 'Đọc nhiều nhất' },
		{ value: 'month', title: 'Review nhiều nhất' },
		{ value: 'months', title: 'Được Like nhiều nhất ' },
		{ value: 'topFollow', title: ' Được Follow nhiều nhất ' },
	];

	const getTopBooksData = async () => {
		const params = {
			sortType: valueDataSort,
			by: valueDate,
		};

		try {
			if (valueDataSort) {
				const topBooks = await dispatch(getFilterTopUser(params)).unwrap();
				setGetListTopBooks(topBooks);
			} else {
				const topBooks = await dispatch(getTopUser(params)).unwrap();
				setGetListTopBooks(topBooks);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		getTopBooksData();
	}, [topUserFilter, valueDate, valueDataSort]);

	const onchangeKindOfGroup = data => {
		kindOfGroupRef.current = data;
		setTopUserFilter(data.id);
	};

	const onchangeKindOfDate = data => {
		listYearRef.current = data;
		setValueDate(data.value);
	};

	const onchangeSortType = data => {
		listRead.current = data;
		setValueDataSort(data.value);
	};

	return (
		<div className='topbooks__container'>
			<div className='topbooks__container__header'>
				<div className='topbooks__container__title'>TOP 100 người dùng</div>
				<SelectBox
					name='themeGroup'
					list={listDataSortType}
					defaultOption={listRead.current}
					onChangeOption={onchangeSortType}
				/>
			</div>
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
			{getListTopBooks.length > 1 && (
				<TopRanks getListTopBooks={getListTopBooks} listDataSortType={listDataSortType} />
			)}
			{getListTopBooks.map((item, index) => (
				<div key={item.id} className='topbooks__container__main top__user'>
					<StarRanking index={index} />
					<div className='topbooks__container__main__layout'>
						<AuthorCard size='lg' item={item} />
					</div>
					<div className='author-book__share'>
						<ShareRanks />
					</div>
				</div>
			))}
		</div>
	);
};
TopUser.propTypes = {
	rows: PropTypes.array,
	listYear: PropTypes.array,
};

export default TopUser;
