import './ranks.scss';
import { BackArrow } from 'components/svg';
import NormalContainer from 'components/layout/normal-container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Link } from 'react-router-dom';

const Ranks = () => {
	return (
		<NormalContainer>
			<div className='ranks__container'>
				<div className='ranks__container__main'>
					<Link to={'/'} className='ranks__container__main__back'>
						<BackArrow />
					</Link>
					<div className='ranks__container__main__title'>Bảng xếp hạng</div>
				</div>
				<div className='ranks__container__main_main'>
					<Tabs defaultActiveKey='books'>
						<Tab eventKey='books' title='Sách'></Tab>
						<Tab eventKey='author' title='Tác giả'></Tab>
						<Tab eventKey='User' title='Người dùng'></Tab>
						<Tab eventKey='quotes' title='Quotes'></Tab>
					</Tabs>
				</div>
			</div>
		</NormalContainer>
	);
};
export default Ranks;
