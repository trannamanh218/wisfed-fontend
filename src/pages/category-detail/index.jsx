import MainContainer from 'components/layout/main-container';
import { STATUS_SUCCESS, STATUS_IDLE, STATUS_LOADING } from 'constants';
import RouteLink from 'helpers/RouteLink';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCategoryDetail } from 'reducers/redux-utils/category';
import MainCategoryDetail from './main-category-detail';
import SidebarCategoryDetail from './sidebar-category-detail';
import { NotificationError } from 'helpers/Error';

const CategoryDetail = () => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		window.scroll(0, 0);
	}, []);

	const viewCategoryDetail = async data => {
		setStatus(STATUS_LOADING);
		try {
			await dispatch(getCategoryDetail(data.id)).unwrap();
			setStatus(STATUS_SUCCESS);
			navigate(RouteLink.categoryDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<MainContainer
			main={<MainCategoryDetail />}
			right={<SidebarCategoryDetail status={status} viewCategoryDetail={viewCategoryDetail} />}
		/>
	);
};

export default CategoryDetail;
