import SelectBox from 'shared/select-box';
import { useRef, useEffect, useState } from 'react';
import AuthorCard from 'shared/author-card';
import StarRanking from 'shared/starRanks';
import './top-user.scss';
import { ShareRanks } from 'components/svg';
import TopRanks from 'shared/top-ranks';
import PropTypes from 'prop-types';
import { NotificationError } from 'helpers/Error';
import { useDispatch, useSelector } from 'react-redux';
import { getTopUser } from 'reducers/redux-utils/ranks';
import dropdownIcon from 'assets/images/dropdown.png';
import ModalCheckLogin from 'shared/modal-check-login';
import Storage from 'helpers/Storage';
import { saveDataShare } from 'reducers/redux-utils/post';
import { useNavigate } from 'react-router-dom';
import { TOP_USER_VERB_SHARE_LV1 } from 'constants/index';
import ModalSearchCategories from '../modal-search-categories/ModalSearchCategories';
import LoadingIndicator from 'shared/loading-indicator';

const TopUser = ({ listYear, tabSelected }) => {
	const kindOfGroupRef = useRef({ value: 'default', name: 'Chủ đề' });
	const listYearRef = useRef({ value: 'default', title: 'Tuần' });
	const listRead = useRef({ value: 'default', title: 'Đọc nhiều nhất' });
	const { isAuth } = useSelector(state => state.auth);
	const [topUserFilter, setTopUserFilter] = useState(null);
	const [disableSelectBox, setDisableSelectBox] = useState(false);
	const [valueDate, setValueDate] = useState('week');
	const [valueDataSort, setValueDataSort] = useState('topRead');
	const [getListTopBooks, setGetListTopBooks] = useState([]);
	const [modalShow, setModalShow] = useState(false);
	const [modalSearchCategoriesShow, setModalSearchCategoriesShow] = useState(false);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const listDataSortType = [
		{ value: 'topRead', title: 'Đọc nhiều nhất' },
		{ value: 'topReview', title: 'Review nhiều nhất' },
		{ value: 'topLike', title: 'Được Like nhiều nhất ' },
		{ value: 'topFollow', title: ' Được Follow nhiều nhất ' },
	];

	const getTopUserData = async () => {
		setLoading(true);
		let params = {};
		if (valueDataSort === 'topFollow' || valueDataSort === 'topLike') {
			params = {
				reportType: valueDataSort,
				by: valueDate,
			};
			setDisableSelectBox(true);
		} else {
			params = {
				reportType: valueDataSort,
				by: valueDate,
				categoryId: topUserFilter,
			};
			setDisableSelectBox(false);
		}

		try {
			const topUser = await dispatch(getTopUser(params)).unwrap();
			setGetListTopBooks(topUser.rows);
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (tabSelected === 'User') {
			getTopUserData();
		}
	}, [topUserFilter, valueDate, valueDataSort, isAuth, tabSelected]);

	const onchangeKindOfGroup = data => {
		kindOfGroupRef.current = data;
		setTopUserFilter(data.id);
	};

	const onchangeKindOfDate = data => {
		listYearRef.current = data;
		setValueDate(data.value);
	};

	const onchangeSortType = data => {
		if (['topLike', 'topFollow'].includes(data.value)) {
			kindOfGroupRef.current = { value: 'default', name: 'Chủ đề' };
			setTopUserFilter(null);
		}
		listRead.current = data;
		setValueDataSort(data.value);
	};

	const handleShare = (data, index) => {
		const newData = {
			by: valueDate,
			categoryId: topUserFilter,
			categoryName:
				valueDataSort !== 'topFollow' && valueDataSort !== 'topLike' ? kindOfGroupRef.current.name : null,
			userType: valueDataSort,
			type: 'topUser',
			id: data.id,
			trueRank: index + 1,
			verb: TOP_USER_VERB_SHARE_LV1,
			...data,
		};
		if (Storage.getAccessToken()) {
			dispatch(saveDataShare(newData));
			navigate('/');
		} else {
			setModalShow(true);
		}
	};

	return (
		<div className='topbooks__container'>
			<ModalCheckLogin setModalShow={setModalShow} modalShow={modalShow} />
			{modalSearchCategoriesShow && (
				<ModalSearchCategories
					setModalSearchCategoriesShow={setModalSearchCategoriesShow}
					modalSearchCategoriesShow={modalSearchCategoriesShow}
					onSelectCategory={onchangeKindOfGroup}
					setTopUserFilter={setTopUserFilter}
				/>
			)}
			<div className='topbooks__container__header'>
				<div className='topbooks__container__title'>TOP 100 người dùng</div>
				<SelectBox
					name='themeGroup'
					list={listDataSortType}
					defaultOption={listRead.current}
					onChangeOption={onchangeSortType}
					className='top-users-slt-box'
				/>
			</div>
			<div className='topbooks__container__sort'>
				<div
					className={`topbooks__container__sort__left ${disableSelectBox && 'disabled-btn-select'}`}
					onClick={() => {
						!disableSelectBox && setModalSearchCategoriesShow(true);
					}}
				>
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

			{getListTopBooks?.length > 2 && (
				<TopRanks getListTopBooks={getListTopBooks} valueDataSort={valueDataSort} />
			)}
			{loading ? (
				<LoadingIndicator />
			) : (
				<>
					{getListTopBooks?.length > 0 ? (
						getListTopBooks.map((item, index) => (
							<div key={index} className='topbooks__container__main top__user'>
								<StarRanking index={index} />
								<div className='topbooks__container__main__layout'>
									<AuthorCard size='lg' item={item} setModalShow={setModalShow} />
								</div>
								<div onClick={() => handleShare(item, index)} className='author-book__share'>
									<ShareRanks />
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
TopUser.propTypes = {
	rows: PropTypes.array,
	listYear: PropTypes.array,
	tabSelected: PropTypes.string,
};

export default TopUser;
