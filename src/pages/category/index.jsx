import { useEffect, useState } from 'react';
import MainContainer from 'components/layout/main-container';
import MainCategory from './main-category';
import SidebarCategory from './sidebar-category';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCategoryDetail } from 'reducers/redux-utils/category';
import RouteLink from 'helpers/RouteLink';
import { getBookDetail } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';

const Category = () => {
	const [isFetching, setIsFetching] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleViewCategoryDetail = async data => {
		setIsFetching(true);
		try {
			await dispatch(getCategoryDetail(data.id)).unwrap();
			navigate(RouteLink.categoryDetail(data.id, data.name));
			setIsFetching(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleViewBookDetail = async data => {
		setIsFetching(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setIsFetching(false);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<MainContainer
			main={
				<MainCategory
					isFetching={isFetching}
					handleViewCategoryDetail={handleViewCategoryDetail}
					handleViewBookDetail={handleViewBookDetail}
				/>
			}
			right={<SidebarCategory isFetching={isFetching} handleViewCategoryDetail={handleViewCategoryDetail} />}
		/>
	);
};

export default Category;
