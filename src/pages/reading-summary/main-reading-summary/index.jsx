import { Col, Nav, Row, Tab, TabContainer } from 'react-bootstrap';
import { propTypes } from 'react-bootstrap/esm/Image';
import BookTab from './book-tab';
import './main-reading-summary.scss';
import PageTab from './page-tab';
import ReadBookTab from './read-book-tab';

const MainReadingSummary = ({ setErrorLoadPage }) => {
	return (
		<div className='main-reading-summary'>
			<TabContainer defaultActiveKey='books'>
				<Row>
					<Col sm={12}>
						<Nav className='main-reading-summary__nav'>
							<Nav.Item>
								<Nav.Link eventKey='books'>Các sách đã đọc</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey='book-charts'>Số sách đã đọc</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey='page-charts'>Số trang đã đọc</Nav.Link>
							</Nav.Item>
						</Nav>
					</Col>

					<Col sm={12}>
						<Tab.Content>
							<Tab.Pane eventKey='books'>
								<ReadBookTab />
							</Tab.Pane>
							<Tab.Pane eventKey='book-charts'>
								<BookTab setErrorLoadPage={setErrorLoadPage} />
							</Tab.Pane>
							<Tab.Pane eventKey='page-charts'>
								<PageTab />
							</Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</TabContainer>
		</div>
	);
};

MainReadingSummary.propTypes = {
	setErrorLoadPage: propTypes.func,
};

export default MainReadingSummary;
