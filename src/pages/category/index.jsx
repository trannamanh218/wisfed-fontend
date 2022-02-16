import React from 'react';
import MainContainer from 'components/layout/main-container';
import MainCategory from './main-category';
import SidebarCategory from './sidebar-category';

const Category = () => {
	return <MainContainer main={<MainCategory />} right={<SidebarCategory />} />;
};

Category.propTypes = {};

export default Category;
