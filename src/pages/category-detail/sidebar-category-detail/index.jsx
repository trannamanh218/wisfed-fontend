import { useFetchOtherCategories } from 'api/category.hook';
import { useFetchGroups } from 'api/group.hooks';
import { useFetchQuotes, useFetchQuotesByCategory } from 'api/quote.hooks';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthorSlider from 'shared/author-slider';
import GroupLinks from 'shared/group-links';
// import NewsLinks from 'shared/news-links';
import QuotesLinks from 'shared/quote-links';
import TopicColumn from 'shared/topic-column';
import PropTypes from 'prop-types';
import './sidebar-category-detail.scss';
import { getRandomAuthor } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';

const SidebarCategoryDetail = ({ handleViewCategoryDetail }) => {
	const { categoryInfo } = useSelector(state => state.category);
	const [name, setName] = useState();
	const [authorList, setAuthorList] = useState([]);
	const [quotesList, setQuotesList] = useState([]);

	const linkClickSeeAll = `/quotes/category/${categoryInfo.id}`;

	const dispatch = useDispatch();

	useEffect(() => {
		getAuthorList();
	}, []);

	useEffect(() => {
		let isMount = true;
		if (isMount && !_.isEmpty(categoryInfo)) {
			setName(categoryInfo.name);
		}

		return () => {
			isMount = false;
		};
	}, [categoryInfo]);

	const {
		otherCategories: { rows: categoriesList = [] },
	} = useFetchOtherCategories(0, 30, name);

	const { quoteData } = useFetchQuotes(0, 3);
	const { listQuotesByCategory } = useFetchQuotesByCategory(categoryInfo?.id, 3);

	useEffect(() => {
		// Lọc ra danh sách quotes từ quoteData mà không có trong listQuotesByCategory
		const newArr = quoteData.filter(item => !listQuotesByCategory.some(quote => quote.id === item.id));

		// Lấy ra một danh sách chỉ có 3 quotes để hiển thị
		if (quotesList) {
			setQuotesList(listQuotesByCategory.concat(newArr).slice(0, 3));
		}
	}, [listQuotesByCategory, quoteData]);

	const {
		groups: { rows: groupList = [] },
	} = useFetchGroups(0, 3, '[]');

	const getAuthorList = async () => {
		try {
			const params = { limit: 10 };
			const res = await dispatch(getRandomAuthor(params)).unwrap();
			if (res.length) {
				setAuthorList(res);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<>
			{!_.isEmpty(categoryInfo) && (
				<div className='sidebar-category-detail'>
					<TopicColumn
						className='sidebar-category__topics'
						title='Chủ đề khác'
						topics={categoriesList}
						handleViewCategoryDetail={handleViewCategoryDetail}
						inCategory={true}
					/>
					<AuthorSlider title='Tác giả nổi bật' list={authorList} size='lg' />
					<div className='sidebar-category-detail__quotes'>
						<QuotesLinks
							list={quotesList}
							title='Quotes'
							className='sidebar-category-detail__quotes'
							linkClickSeeAll={linkClickSeeAll}
						/>
						<GroupLinks list={groupList} title='Group' />
						{/* <NewsLinks list={quoteList} title='Tin tức liên quan' /> */}
					</div>
				</div>
			)}
		</>
	);
};

SidebarCategoryDetail.propTypes = {
	handleViewCategoryDetail: PropTypes.func,
};

export default SidebarCategoryDetail;
