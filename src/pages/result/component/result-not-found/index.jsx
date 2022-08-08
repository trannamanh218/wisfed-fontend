import Searching from 'assets/images/Searching.png';
import './result-not-found.scss';

const ResultNotFound = () => {
	return (
		<div className='result__notfound__main'>
			<img src={Searching} alt='Không tìm thấy' />
			<div className='result__notfound__title'>Không tìm thấy kết quả nào</div>
			<div className='result__notfound__decription'>
				Đảm bảo tất cả các từ đều đúng chính tả hoặc thử từ khóa khác
			</div>
		</div>
	);
};
export default ResultNotFound;
