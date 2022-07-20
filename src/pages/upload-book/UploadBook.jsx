import MainContainer from 'components/layout/main-container';
import MainUpload from './main-upload/MainUpload';
import SidebarUpload from './sidebar-upload/SidebarUpload';

export default function UploadBook() {
	return (
		<>
			<MainContainer main={<MainUpload />} right={<SidebarUpload />} />
		</>
	);
}
