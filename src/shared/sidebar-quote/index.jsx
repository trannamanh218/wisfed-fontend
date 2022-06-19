import MyShelvesList from 'shared/my-shelves-list';
import StatisticList from 'shared/statistic-list';
import './sidebar-quote.scss';
import { useSelector } from 'react-redux';
import TopicColumn from 'shared/topic-column';
import PropTypes from 'prop-types';
import _ from 'lodash';

const SidebarQuote = ({ listHashtags }) => {
	const myAllLibrary = useSelector(state => state.library.myAllLibrary);

	return (
		<div className='sidebar-quote'>
			{!!listHashtags.length && (
				<TopicColumn className='sidebar-category__topics' title='Hashtag từ Quotes' topics={listHashtags} />
			)}
			{!_.isEmpty(myAllLibrary) && (
				<>
					<StatisticList
						className='sidebar-quote__reading__status'
						title='Trạng thái đọc'
						background='light'
						isBackground={true}
						list={myAllLibrary.default}
						pageText={false}
					/>
					<MyShelvesList list={myAllLibrary.custom} />
				</>
			)}
		</div>
	);
};

SidebarQuote.propTypes = {
	listHashtags: PropTypes.array,
};

export default SidebarQuote;
