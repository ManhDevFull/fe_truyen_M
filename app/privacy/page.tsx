export default function PrivacyPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Chính sách bảo mật</h1>
      <p className="text-sm text-black/70">
        Chính sách này mô tả cách TruyenM thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi sử dụng dịch vụ.
      </p>
      <h2 className="text-xl font-semibold">Thông tin chúng tôi thu thập</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
        <li>Thông tin tài khoản: email, tên hiển thị, thông tin xác thực.</li>
        <li>Dữ liệu sử dụng: lịch sử đọc, thời gian đọc, tương tác với nội dung.</li>
        <li>Dữ liệu thiết bị: trình duyệt, địa chỉ IP, cookie và thông tin phiên.</li>
      </ul>
      <h2 className="text-xl font-semibold">Mục đích sử dụng</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
        <li>Cung cấp và duy trì dịch vụ, cá nhân hóa trải nghiệm đọc.</li>
        <li>Phát hiện gian lận, bảo vệ hệ thống và an toàn tài khoản.</li>
        <li>Thông báo khi có chương mới đối với truyện bạn theo dõi.</li>
      </ul>
      <h2 className="text-xl font-semibold">Cookie và công nghệ theo dõi</h2>
      <p className="text-sm text-black/70">
        Chúng tôi sử dụng cookie để ghi nhớ đăng nhập, tối ưu hiệu năng và đo lường truy cập. Bạn có thể chặn cookie trong
        trình duyệt, tuy nhiên một số tính năng có thể bị hạn chế.
      </p>
      <h2 className="text-xl font-semibold">Chia sẻ dữ liệu</h2>
      <p className="text-sm text-black/70">
        TruyenM không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ khi có yêu cầu pháp lý hợp lệ hoặc để vận hành hệ thống
        (ví dụ: lưu trữ, bảo mật), và luôn trong phạm vi cần thiết.
      </p>
      <h2 className="text-xl font-semibold">Bảo mật dữ liệu</h2>
      <p className="text-sm text-black/70">
        Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ dữ liệu. Tuy nhiên, không có hệ thống nào an toàn tuyệt
        đối; vui lòng bảo vệ mật khẩu và thiết bị của bạn.
      </p>
      <h2 className="text-xl font-semibold">Quyền của người dùng</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
        <li>Yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân.</li>
        <li>Rút lại quyền nhận thông báo.</li>
        <li>Yêu cầu ngừng sử dụng hoặc xóa tài khoản.</li>
      </ul>
      <h2 className="text-xl font-semibold">Liên hệ</h2>
      <p className="text-sm text-black/70">
        Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ: <strong>ntmanh@ntmanh.io.vn</strong>.
      </p>
    </div>
  );
}
