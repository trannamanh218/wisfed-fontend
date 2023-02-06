import MainContainer from 'components/layout/main-container';
import RouteLink from 'helpers/RouteLink';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCategoryDetail } from 'reducers/redux-utils/category';
import MainCategoryDetail from './main-category-detail';
import SidebarCategoryDetail from './sidebar-category-detail';
import { NotificationError } from 'helpers/Error';
import Circle from 'shared/loading/circle';
import NotFound from 'pages/not-found';

const CategoryDetail = () => {
	const [isFetching, setIsFetching] = useState(false);
	const [errorLoadPage, setErrorLoadPage] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleViewCategoryDetail = async data => {
		setIsFetching(true);
		try {
			await dispatch(getCategoryDetail(data.id)).unwrap();
			navigate(RouteLink.categoryDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<>
			<Circle loading={isFetching} />
			{!errorLoadPage ? (
				<MainContainer
					main={<MainCategoryDetail setErrorLoadPage={setErrorLoadPage} />}
					right={<SidebarCategoryDetail handleViewCategoryDetail={handleViewCategoryDetail} />}
				/>
			) : (
				<NotFound />
			)}
		</>
	);
};

export default CategoryDetail;
