import MainContainer from 'components/layout/main-container';
import React from 'react';
import MainCategoryDetail from './main-category-detail';
import SidebarCategoryDetail from './sidebar-category-detail';

const CategoryDetail = () => {
	return <MainContainer main={<MainCategoryDetail />} right={<SidebarCategoryDetail />} />;
};

CategoryDetail.propTypes = {};

export default CategoryDetail;
