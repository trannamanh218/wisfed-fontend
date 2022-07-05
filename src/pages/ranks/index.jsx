import './ranks.scss';
import { BackArrow } from 'components/svg';
import NormalContainer from 'components/layout/normal-container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Link } from 'react-router-dom';
import TopBooks from './component/top-Books';
import TopUser from './component/top-user';
import TopQuotes from './component/top-quotes';
import { useFetchViewMoreCategories } from 'api/category.hook';
const MAX_PER_PAGE = 30;

const Ranks = () => {
	const {
		categoryData: { rows = [] },
	} = useFetchViewMoreCategories(1, MAX_PER_PAGE, '[]');
	const listYear = [
		{ value: 'week', title: 'Tuần' },
		{ value: 'month', title: 'Tháng' },
		{ value: 'year', title: ' Năm' },
	];
	return (
		<NormalContainer>
			<div className='ranks__container'>
				<div className='ranks__container__header'>
					<Link to={'/'} className='ranks__container__main__back'>
						<BackArrow />
					</Link>
					<div className='ranks__container__main__title'>Bảng xếp hạng</div>
				</div>
				<div className='ranks__container__main'>
					<Tabs defaultActiveKey='books'>
						<Tab eventKey='books' title='Sách'>
							<TopBooks rows={rows} listYear={listYear} />
						</Tab>
						<Tab eventKey='User' title='Người dùng'>
							<TopUser rows={rows} listYear={listYear} />
						</Tab>
						<Tab eventKey='quotes' title='Quotes'>
							<TopQuotes rows={rows} listYear={listYear} />
						</Tab>
					</Tabs>
				</div>
			</div>
		</NormalContainer>
	);
};

export default Ranks;
