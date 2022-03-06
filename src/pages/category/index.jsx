import React, { useState } from 'react';
import MainContainer from 'components/layout/main-container';
import MainCategory from './main-category';
import SidebarCategory from './sidebar-category';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { STATUS_IDLE } from 'constants';
import { STATUS_LOADING } from 'constants';
import { getCategoryDetail } from 'reducers/redux-utils/category';
import { STATUS_SUCCESS } from 'constants';
import RouteLink from 'helpers/RouteLink';
import { getBookDetail } from 'reducers/redux-utils/book';

const Category = () => {
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
			main={
				<MainCategory
					status={status}
					viewCategoryDetail={viewCategoryDetail}
					handleViewBookDetail={handleViewBookDetail}
				/>
			}
			right={<SidebarCategory status={status} viewCategoryDetail={viewCategoryDetail} />}
		/>
	);
};

Category.propTypes = {};

export default Category;
