import NormalContainer from 'components/layout/normal-container';
import './result.scss';
import { Configure } from 'components/svg';
import SearchButton from 'shared/search-button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BookSearch from './component/books-search';
import QuoteSearch from './component/quotes-search';
const Result = () => {
	return (
		<NormalContainer>
			<div className='result__container'>
				<div className='result__header'>
					<div className='result__header__content'>Kết quả tìm kiếm cho</div>
				</div>
				<div className='result__search'>
					<div className='friends__header'>
						<SearchButton />
					</div>
				</div>
				<div className='result__main'>
					<Tabs defaultActiveKey='books'>
						<Tab eventKey='books' title='Sách'>
							<BookSearch />
						</Tab>
						<Tab eventKey='group' title='Nhóm'></Tab>
						<Tab eventKey='quotes' title='Quotes'>
							<QuoteSearch />
						</Tab>
						<Tab eventKey='everyone' title='Mọi người'></Tab>
						<Tab eventKey='story' title='Câu chuyện'></Tab>
					</Tabs>
				</div>
			</div>
		</NormalContainer>
	);
};

export default Result;
