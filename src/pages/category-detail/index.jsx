import MainContainer from 'components/layout/main-container';
import { STATUS_SUCCESS } from 'constants';
import { STATUS_LOADING } from 'constants';
import { STATUS_IDLE } from 'constants';
import RouteLink from 'helpers/RouteLink';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBookDetail } from 'reducers/redux-utils/book';
import { getCategoryDetail } from 'reducers/redux-utils/category';
import MainCategoryDetail from './main-category-detail';
import SidebarCategoryDetail from './sidebar-category-detail';

const CategoryDetail = () => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const viewCategoryDetail = async data => {
		setStatus(STATUS_LOADING);
		try {
			await dispatch(getCategoryDetail(data.id)).unwrap();
			setStatus(STATUS_SUCCESS);
			navigate(RouteLink.categoryDetail(data.id, data.name));
		} catch (err) {
			const statusCode = err?.statusCode || 500;
			setStatus(statusCode);
		}
	};

	const handleViewBookDetail = async data => {
		setStatus(STATUS_LOADING);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setStatus(STATUS_SUCCESS);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			const statusCode = err?.statusCode || 500;
			setStatus(statusCode);
		}
	};

	return (
		<MainContainer
			main={<MainCategoryDetail handleViewBookDetail={handleViewBookDetail} />}
			right={<SidebarCategoryDetail status={status} viewCategoryDetail={viewCategoryDetail} />}
		/>
	);
};

CategoryDetail.propTypes = {};

export default CategoryDetail;
