import { useFetchViewMoreCategories } from 'api/category.hook';
import { useEffect, useState } from 'react';
import StatisticList from 'shared/statistic-list';
import TopicColumn from 'shared/topic-column';
import PropTypes from 'prop-types';
import Circle from 'shared/loading/circle';
import './sidebar-category.scss';
import { useDispatch } from 'react-redux';
import { getFavoriteCategories } from 'reducers/redux-utils/category';
import { NotificationError } from 'helpers/Error';

const SidebarCategory = ({ isFetching, handleViewCategoryDetail }) => {
	const [favoriteCategories, setFavorriteCategories] = useState([]);

	const dispatch = useDispatch();

	const {
		categoryData: { rows = [] },
	} = useFetchViewMoreCategories(0, 30, '[]');

	useEffect(() => {
		getFavoriteCategoriesData();
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
				topics={rows}
				title='Tất cả chủ đề'
				handleViewCategoryDetail={handleViewCategoryDetail}
				inCategory={true}
			/>
		</div>
	);
};

SidebarCategory.propTypes = {
	status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	handleViewCategoryDetail: PropTypes.func,
};

export default SidebarCategory;
