import SelectBox from 'shared/select-box';
import { useRef, useEffect, useState } from 'react';
import StarRanking from 'shared/starRanks';
import TopQuotesComponent from 'shared/top-quotes';
import { getTopQuotes } from 'reducers/redux-utils/ranks';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';

const TopQuotes = ({ rows, listYear, tabSelected }) => {
	const [topQuotesId, setTopQuotesId] = useState(null);
	const [valueDate, setValueData] = useState('week');
	const [getListTopQuotes, setGetListTopQuotes] = useState([]);

	const kindOfGroupRef = useRef({ value: 'default', title: 'Chủ đề' });
	const listYearRef = useRef({ value: 'default', title: 'Tuần' });

	const dispatch = useDispatch();

	const getTopQuotesData = async () => {
		const params = {
			categoryId: topQuotesId,
			by: valueDate,
		};
		try {
			const topQuotes = await dispatch(getTopQuotes(params)).unwrap();
			setGetListTopQuotes(topQuotes.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		if (tabSelected === 'quotes') {
			getTopQuotesData();
		}
	}, [topQuotesId, valueDate, tabSelected]);

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
			<div className='topbooks__container__title'>TOP 100 Quotes được like nhiều nhất</div>
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
			{getListTopQuotes.length > 0 ? (
				getListTopQuotes.map((item, index) => (
					<div key={item.id} className='topbooks__container__main'>
						<StarRanking index={index} />
						<div className='topbooks__container__main__layout'>
							<TopQuotesComponent
								item={item}
								valueDate={valueDate}
								categoryItem={kindOfGroupRef.current}
							/>
						</div>
					</div>
				))
			) : (
				<div className='topbooks__notthing'>Không có dữ liệu</div>
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
