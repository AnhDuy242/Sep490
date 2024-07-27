import React from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import './layout/anout.css'
import noisoi from './layout/image/noisoi.png'
import mri from './layout/image/mri.png'
import sieuam from './layout/image/sieuam4d.png'
import xquang from './layout/image/xquang.png'
import dientamdo from './layout/image/dientamdo.png'
import { Helmet } from 'react-helmet';

const About3 = () => {
    return (
        <>
            <Helmet>
                <title>Trang thiết bị hiện đại tại phòng khám</title>
            </Helmet>
            <Header />
            <NavBar />
            <div className="about-container">
                <h1 className="about-title">Trang Thiết Bị Hiện Đại Tại Phòng Khám Đa Khoa 68A Hà Đông</h1>
                <div className="about-content">
                    <h2>I. Hệ Thống Máy MRI</h2>
                    <p>Phòng khám đa khoa 68A Hà Đông sở hữu hệ thống máy cộng hưởng từ (MRI) tiên tiến, cho phép thực hiện các chẩn đoán hình ảnh chi tiết và chính xác. Máy MRI tại phòng khám sử dụng công nghệ hiện đại, có khả năng chụp cắt lớp toàn thân với độ phân giải cao, giúp phát hiện sớm các bệnh lý phức tạp. Đây là công cụ đắc lực trong việc chẩn đoán các bệnh về thần kinh, cơ xương khớp, tim mạch và nhiều bệnh lý khác.</p>
                    <p>Máy MRI của phòng khám không chỉ giúp chẩn đoán bệnh mà còn hỗ trợ trong việc lên kế hoạch điều trị cụ thể và hiệu quả. Đặc biệt, với các bệnh lý phức tạp như ung thư, tổn thương não, bệnh lý cột sống, việc sử dụng máy MRI giúp bác sĩ xác định chính xác vị trí và mức độ tổn thương, từ đó đưa ra phương pháp điều trị phù hợp nhất.</p>
                    <img src={mri} alt="Phòng khám Đa khoa 68A Hà Đông" className="about-image" />
                    <p className="image-caption">Phòng khám đa khoa 68A Hà Đông với trang thiết bị hiện đại</p>
                    <h2>II. Máy Siêu Âm 4D</h2>
                    <p>Máy siêu âm 4D tại phòng khám cung cấp hình ảnh siêu âm chân thực và rõ nét, giúp bác sĩ quan sát chi tiết cấu trúc cơ thể và các cơ quan nội tạng. Thiết bị này đặc biệt hữu ích trong việc theo dõi sự phát triển của thai nhi, chẩn đoán các vấn đề về phụ khoa, tim mạch và nhiều bệnh lý khác. Với máy siêu âm 4D, bệnh nhân có thể yên tâm về độ chính xác và an toàn trong quá trình thăm khám.</p>
                    <p>Siêu âm 4D giúp theo dõi sự phát triển của thai nhi một cách toàn diện, từ việc quan sát chuyển động đến đánh giá cấu trúc cơ thể. Điều này rất quan trọng trong việc phát hiện sớm các dị tật bẩm sinh và các vấn đề sức khỏe của thai nhi, đảm bảo sự an toàn và sức khỏe cho cả mẹ và bé.</p>
                    <img src={sieuam} alt="Phòng khám Đa khoa 68A Hà Đông" className="about-image" />
                    <p className="image-caption">Phòng khám đa khoa 68A Hà Đông với trang thiết bị hiện đại</p>
                    <h2>III. Hệ Thống X-Quang Kỹ Thuật Số</h2>
                    <p>Phòng khám sử dụng hệ thống X-quang kỹ thuật số hiện đại, giúp giảm thiểu liều lượng tia X và mang lại hình ảnh rõ nét, chi tiết. Hệ thống này hỗ trợ hiệu quả trong việc chẩn đoán các bệnh lý về xương, phổi, tim mạch và các vấn đề khác liên quan đến cơ quan nội tạng. Quá trình chụp X-quang tại phòng khám được thực hiện nhanh chóng và an toàn, đảm bảo sức khỏe cho bệnh nhân.</p>
                    <p>X-quang kỹ thuật số không chỉ giúp phát hiện các vấn đề về xương và khớp mà còn hỗ trợ trong việc chẩn đoán các bệnh lý về phổi, như viêm phổi, lao phổi, và các khối u. Điều này đặc biệt quan trọng trong việc phát hiện sớm và điều trị kịp thời, giúp giảm nguy cơ biến chứng và tăng cơ hội hồi phục cho bệnh nhân.</p>
                    <img src={xquang} alt="Phòng khám Đa khoa 68A Hà Đông" className="about-image" />
                    <p className="image-caption">Phòng khám đa khoa 68A Hà Đông với trang thiết bị hiện đại</p>
                    <h2>IV. Máy Nội Soi Tiêu Hóa</h2>
                    <p>Máy nội soi tiêu hóa tại phòng khám là thiết bị hiện đại, giúp chẩn đoán và điều trị các bệnh lý về dạ dày, đại tràng và các cơ quan tiêu hóa khác. Với công nghệ tiên tiến, máy nội soi cho phép quan sát trực tiếp niêm mạc tiêu hóa, phát hiện sớm các tổn thương và bệnh lý, từ đó đưa ra phương pháp điều trị kịp thời và hiệu quả.</p>
                    <p>Nội soi tiêu hóa là phương pháp hiệu quả trong việc phát hiện sớm các bệnh lý như viêm loét dạ dày, polyp đại tràng, và ung thư tiêu hóa. Phòng khám còn cung cấp các dịch vụ nội soi không đau, giúp bệnh nhân thoải mái và giảm bớt lo lắng trong quá trình thăm khám và điều trị.</p>
                    <img src={noisoi} alt="Phòng khám Đa khoa 68A Hà Đông" className="about-image" />
                    <p className="image-caption">Phòng khám đa khoa 68A Hà Đông với trang thiết bị hiện đại</p>
                    <h2>V. Máy Điện Tâm Đồ (ECG)</h2>
                    <p>Máy điện tâm đồ (ECG) tại phòng khám đa khoa 68A Hà Đông là thiết bị không thể thiếu trong việc chẩn đoán các bệnh lý về tim mạch. Thiết bị này giúp ghi lại hoạt động điện của tim, phát hiện các rối loạn nhịp tim, thiếu máu cơ tim và nhiều vấn đề khác. Máy ECG hiện đại tại phòng khám đảm bảo độ chính xác cao, giúp bác sĩ đưa ra chẩn đoán và điều trị chính xác.</p>
                    <p>ECG là công cụ quan trọng trong việc theo dõi và quản lý các bệnh lý tim mạch mãn tính. Phòng khám cung cấp dịch vụ ECG 24 giờ, giúp theo dõi liên tục hoạt động của tim, từ đó phát hiện kịp thời các biến chứng nguy hiểm và đưa ra phương pháp điều trị phù hợp.</p>
                    <img src={dientamdo} alt="Phòng khám Đa khoa 68A Hà Đông" className="about-image" />
                    <p className="image-caption">Phòng khám đa khoa 68A Hà Đông với trang thiết bị hiện đại</p>
                    <h2>VI. Máy Đo Đường Huyết Và Chỉ Số Sức Khỏe</h2>
                    <p>Phòng khám trang bị các máy đo đường huyết và chỉ số sức khỏe hiện đại, giúp theo dõi và quản lý các bệnh lý mãn tính như tiểu đường, huyết áp cao. Thiết bị này cung cấp kết quả nhanh chóng và chính xác, hỗ trợ bác sĩ trong việc theo dõi tình trạng sức khỏe của bệnh nhân và điều chỉnh phương pháp điều trị phù hợp.</p>
                    <p>Máy đo đường huyết không chỉ giúp kiểm soát bệnh tiểu đường mà còn giúp phát hiện sớm các biến chứng liên quan đến bệnh, như tổn thương mắt, thận, và hệ thần kinh. Phòng khám còn cung cấp các dịch vụ tư vấn và giáo dục sức khỏe, giúp bệnh nhân hiểu rõ hơn về bệnh lý của mình và cách quản lý hiệu quả.</p>

                    <h2>VII. Phòng Thí Nghiệm Tiêu Chuẩn</h2>
                    <p>Phòng khám đa khoa 68A Hà Đông có phòng thí nghiệm đạt tiêu chuẩn quốc tế, được trang bị đầy đủ các thiết bị xét nghiệm hiện đại. Phòng thí nghiệm thực hiện các xét nghiệm máu, nước tiểu, sinh hóa, vi sinh và nhiều loại xét nghiệm khác, đảm bảo kết quả chính xác và nhanh chóng. Đây là cơ sở quan trọng giúp bác sĩ đưa ra chẩn đoán chính xác và kịp thời.</p>
                    <p>Phòng thí nghiệm tại phòng khám còn có khả năng thực hiện các xét nghiệm chuyên sâu, hỗ trợ trong việc chẩn đoán các bệnh lý phức tạp như bệnh truyền nhiễm, bệnh lý di truyền, và các rối loạn chuyển hóa. Đội ngũ kỹ thuật viên tại phòng thí nghiệm được đào tạo chuyên sâu, đảm bảo quy trình xét nghiệm được thực hiện chính xác và an toàn.</p>

                    <h2>VIII. Máy Chụp Cắt Lớp Vi Tính (CT Scanner)</h2>
                    <p>Phòng khám sở hữu máy chụp cắt lớp vi tính (CT Scanner) hiện đại, cho phép chụp hình ảnh chi tiết các cơ quan nội tạng, xương và mô mềm. Máy CT Scanner hỗ trợ chẩn đoán các bệnh lý phức tạp như ung thư, tổn thương não, tổn thương cột sống và nhiều vấn đề khác. Thiết bị này mang lại hình ảnh chất lượng cao, giúp bác sĩ đánh giá chính xác tình trạng bệnh lý.</p>
                    <p>Máy CT Scanner tại phòng khám còn hỗ trợ trong việc lập kế hoạch phẫu thuật và đánh giá hiệu quả điều trị. Hình ảnh CT chi tiết giúp bác sĩ có cái nhìn toàn diện về tình trạng bệnh lý của bệnh nhân, từ đó đưa ra các quyết định điều trị chính xác và hiệu quả.</p>

                    <h2>IX. Hệ Thống Gây Mê Hồi Sức</h2>
                    <p>Phòng khám được trang bị hệ thống gây mê hồi sức tiên tiến, đảm bảo an toàn và hiệu quả trong các ca phẫu thuật. Hệ thống này giúp kiểm soát quá trình gây mê, theo dõi tình trạng sức khỏe của bệnh nhân trong suốt quá trình phẫu thuật và hồi sức. Đội ngũ y bác sĩ tại phòng khám được đào tạo chuyên sâu về gây mê hồi sức, đảm bảo sự an tâm và an toàn cho bệnh nhân.</p>
                    <p>Quá trình gây mê hồi sức tại phòng khám được thực hiện theo tiêu chuẩn quốc tế, với sự giám sát chặt chẽ của đội ngũ bác sĩ chuyên khoa. Hệ thống thiết bị hiện đại giúp phát hiện sớm và xử lý kịp thời các biến chứng trong quá trình gây mê, đảm bảo an toàn tối đa cho bệnh nhân.</p>

                    <h2>X. Thiết Bị Vật Lý Trị Liệu Và Phục Hồi Chức Năng</h2>
                    <p>Phòng khám đa khoa 68A Hà Đông còn chú trọng đến các dịch vụ vật lý trị liệu và phục hồi chức năng. Các thiết bị vật lý trị liệu hiện đại như máy siêu âm trị liệu, máy kéo giãn cột sống, máy điện xung trị liệu giúp điều trị và phục hồi các vấn đề về cơ xương khớp, chấn thương thể thao và các bệnh lý liên quan. Chương trình phục hồi chức năng tại phòng khám được thiết kế khoa học và hiệu quả, giúp bệnh nhân nhanh chóng lấy lại sức khỏe.</p>
                    <p>Dịch vụ vật lý trị liệu tại phòng khám không chỉ tập trung vào điều trị mà còn hướng đến việc ngăn ngừa tái phát và cải thiện chất lượng cuộc sống cho bệnh nhân. Đội ngũ chuyên gia vật lý trị liệu tại phòng khám luôn đồng hành cùng bệnh nhân trong suốt quá trình điều trị, cung cấp các bài tập và chương trình phục hồi cá nhân hóa, đảm bảo hiệu quả và an toàn.</p>

                </div>
            </div>
            <Footer />
        </>
    );
}

export default About3;
