import { useEffect, useState, useRef } from 'react';
import StatisticList from 'shared/statistic-list';
import TopicColumn from 'shared/topic-column';
import PropTypes from 'prop-types';
import Circle from 'shared/loading/circle';
import './sidebar-category.scss';
import { useDispatch } from 'react-redux';
import { getCategoryList, getFavoriteCategories } from 'reducers/redux-utils/category';
import { NotificationError } from 'helpers/Error';

const SidebarCategory = ({ isFetching, handleViewCategoryDetail }) => {
	const [favoriteCategories, setFavorriteCategories] = useState([]);
	const [hasMore, setHasMore] = useState(false);
	const [topicsProp, setTopicsProp] = useState([]);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();

	useEffect(() => {
		getFavoriteCategoriesData();
		getCategories();
	}, []);

	const getFavoriteCategoriesData = async () => {
		try {
			const params = {
				start: 0,
				limit: 20,
			};
			const res = await dispatch(getFavoriteCategories(params)).unwrap();
			setFavorriteCategories(res.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getCategories = async () => {
		const query = {
			start: callApiStart.current,
			limit: callApiPerPage.current,
			sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			filter: JSON.stringify([{ 'operator': 'ne', 'value': 0, 'property': 'numberBooks' }]),
		};
		try {
			const data = await dispatch(getCategoryList({ option: false, params: query })).unwrap();
			setTopicsProp(prev => [...prev, ...data.rows]);
			setHasMore(true);
			callApiStart.current += callApiPerPage.current;

			if (data.rows?.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const onClickViewMore = () => {
		if (hasMore) {
			getCategories();
		}
	};

	return (
		<div className='sidebar-category'>
			<Circle loading={isFetching} />
			{!!favoriteCategories.length && (
				<StatisticList
					title='Chủ đề yêu thích'
					background='light'
					className='sidebar-category__list'
					isBackground={true}
					list={favoriteCategories}
					pageText={false}
					inCategory={true}
				/>
			)}

			<TopicColumn
				className='sidebar-category__topics'
				topics={topicsProp}
				title='Tất cả chủ đề'
				handleViewCategoryDetail={handleViewCategoryDetail}
				inCategory={true}
				hasMore={hasMore}
				onClickViewMore={onClickViewMore}
			/>
		</div>
	);
};

SidebarCategory.propTypes = {
	status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	handleViewCategoryDetail: PropTypes.func,
};

export default SidebarCategory;
