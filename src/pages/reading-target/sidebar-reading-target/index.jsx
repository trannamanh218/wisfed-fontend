import { useSelector } from 'react-redux';
import StatisticList from 'shared/statistic-list';
import MyShelvesList from 'shared/my-shelves-list';
import { useFetchQuotes } from 'api/quote.hooks';
import QuotesLinks from 'shared/quote-links';
import './sidebar-reading-target.scss';
import { useParams } from 'react-router-dom';
import { useFetchUserParams } from 'api/user.hook';
import _ from 'lodash';

const SidebarReadingTarget = () => {
	const { userInfo } = useSelector(state => state.auth);
	const { userId } = useParams();
	const { userData } = useFetchUserParams(userId);
	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);

	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	return (
		<div className='sidebar-reading-target'>
			{!_.isEmpty(myAllLibraryRedux) && myAllLibraryRedux.custom.length > 0 && (
				<>
					<StatisticList
						className='sidebar-shelves__reading__status'
						title='Trạng thái đọc'
						background='light'
						isBackground={true}
						list={myAllLibraryRedux.default}
						pageText={false}
					/>

					<MyShelvesList list={myAllLibraryRedux.custom} />
				</>
			)}
			<QuotesLinks
				list={quoteData}
				title={userId === userInfo.id ? 'Quotes của tôi' : `Quotes của ${userData.fullName}`}
			/>
		</div>
	);
};

SidebarReadingTarget.propTypes = {};

export default SidebarReadingTarget;
