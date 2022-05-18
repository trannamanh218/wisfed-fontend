import SelectBox from 'shared/select-box';
import React, { useRef, useEffect, useState } from 'react';
import AuthorCard from 'shared/author-card';
import StarRanking from 'shared/starRanks';
import './top-user.scss';
import { ShareRanks } from 'components/svg';
import TopRanks from 'shared/top-ranks';
import PropTypes from 'prop-types';
import { NotificationError } from 'helpers/Error';
import { useDispatch, useSelector } from 'react-redux';
import { getTopUser, getTopUserAuth } from 'reducers/redux-utils/ranks';
import dropdownIcon from 'assets/images/dropdown.png';

const TopUser = ({ rows, listYear }) => {
	const kindOfGroupRef = useRef({ value: 'default', title: 'Chủ đề' });
	const listYearRef = useRef({ value: 'default', title: 'Tuần' });
	const listRead = useRef({ value: 'default', title: 'Đọc nhiều nhất' });
	const { isAuth } = useSelector(state => state.auth);
	const [topUserFilter, setTopUserFilter] = useState(1);
	const [valueDate, setValueDate] = useState('week');
	const [valueDataSort, setValueDataSort] = useState('topRead');
	const [getListTopBooks, setGetListTopBooks] = useState([]);
	const [checkSelectBox, setCheckSelectBox] = useState(false);
	const dispatch = useDispatch();
	const listDataSortType = [
		{ value: 'topRead', title: 'Đọc nhiều nhất' },
		{ value: 'topReview', title: 'Review nhiều nhất' },
		{ value: 'topLike', title: 'Được Like nhiều nhất ' },
		{ value: 'topFollow', title: ' Được Follow nhiều nhất ' },
	];

	const getTopUserData = async () => {
		let params = {};
		if (valueDataSort === 'topFollow') {
			params = {
				sortType: valueDataSort,
				by: valueDate,
			};
			setCheckSelectBox(true);
		} else {
			params = {
				sortType: valueDataSort,
				by: valueDate,
				categoryId: topUserFilter,
			};
			setCheckSelectBox(false);
		}

		try {
			if (isAuth === false) {
				const topUser = await dispatch(getTopUser(params)).unwrap();
				setGetListTopBooks(topUser);
			} else if (isAuth === true) {
				const topUser = await dispatch(getTopUserAuth(params)).unwrap();
				setGetListTopBooks(topUser);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		getTopUserData();
	}, [topUserFilter, valueDate, valueDataSort, isAuth]);

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
					{checkSelectBox ? (
						<div className={`select-box `}>
							<div className='select-box__btn disable'>
								<span className='select-box__value'>Chủ đề</span>
								<img className='select-box__icon' src={dropdownIcon} alt='dropdown' />
							</div>
						</div>
					) : (
						<SelectBox
							name='themeGroup'
							list={rows}
							defaultOption={kindOfGroupRef.current}
							onChangeOption={onchangeKindOfGroup}
						/>
					)}
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
			{getListTopBooks.length > 2 && <TopRanks getListTopBooks={getListTopBooks} valueDataSort={valueDataSort} />}
			{getListTopBooks.length > 0 ? (
				getListTopBooks.map((item, index) => (
					<div key={item.id} className='topbooks__container__main top__user'>
						<StarRanking index={index} />
						<div className='topbooks__container__main__layout'>
							<AuthorCard size='lg' item={item} />
						</div>
						<div className='author-book__share'>
							<ShareRanks />
						</div>
					</div>
				))
			) : (
				<div className='topbooks__notthing'>Không có dữ liệu</div>
			)}
		</div>
	);
};
TopUser.propTypes = {
	rows: PropTypes.array,
	listYear: PropTypes.array,
};

export default TopUser;
