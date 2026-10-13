# LAB 06 - React Native Room Booking

## Thông tin

- Sinh viên: Nguyễn Đình Mạnh
- MSSV: 23IT159
- Công nghệ: React Native + Expo + TypeScript

## Nội dung thực hiện

### 1. Room model

Mở rộng `Room` với thuộc tính `building` để lưu thông tin tòa nhà của phòng.

### 2. Room unavailable

Các phòng có `available = false` sẽ không thể được chọn.

### 3. Selected Room

Sử dụng state `selectedRoom` và prop `isSelected` để hiển thị trạng thái `Selected` cho phòng đang được chọn.

### 4. Booking Summary

Hiển thị:

- Room
- Building
- Purpose

### 5. Reset Form

purpose = "" khi nhấn booking

### 6. Extension B

Thêm chức năng lọc chỉ hiển thị các phòng đang `Available`.

## Chạy project

```bash
npm install
npm start
```

# Lab 07 - Modify & Extend Real-Time Room Booking

**1. Room model đã được thêm field nào?**
Field `floor` (kiểu number), thêm vào type `Room` trong `App.tsx` và vào mọi document trong collection `rooms` trên Firestore.

**2. Vì sao sửa `floor` trên Firebase Console mà app tự cập nhật?**
App đăng ký listener `onSnapshot()` cho collection `rooms`. Khi dữ liệu trên Firestore thay đổi, listener chạy lại và gọi `setRooms(...)`. State `rooms` đổi nên React render lại, `FlatList` và `RoomCard` hiển thị giá trị `floor` mới. Luồng: Firestore → onSnapshot → setRooms → rooms state → UI.

**3. Booking payload đã được thêm field nào?**
Field `bookedBy`. Payload gồm: `roomId`, `roomName`, `building`, `slot`, `purpose`, `bookedBy`, `createdAt`.

**4. `bookedBy` được lưu vào Firestore như thế nào?**
Người dùng nhập tên vào `TextInput` (state `bookedBy`). `handleBookRoom()` kiểm tra tên không rỗng, rồi truyền `bookedBy: bookedBy.trim()` vào `addDoc(collection(db, "bookings"), {...})` rồi lưu vào Firestore.

**5. Building filter hoạt động trên dữ liệu nào?**
Trên state `rooms` (dữ liệu đã lấy từ Firestore bằng `onSnapshot`). `visibleRooms` được tính bằng `rooms.filter(...)` theo `selectedBuilding`. Filter không tạo truy vấn Firestore mới.

**6. Extension đã chọn là gì?**
Extension A — Available Rooms Counter. Số phòng trống được tính bằng `rooms.filter((room) => room.available).length`, không hardcode, nên tự đổi khi `available` thay đổi trên Firestore.

**7. Vì sao Phone B thấy booking do Phone A tạo?**
Phone A gọi `addDoc()` ghi booking lên Firestore. Phone B cũng có listener `onSnapshot()` trên collection `bookings`. Firestore báo thay đổi cho Phone B, `setBookings(...)` chạy, state đổi và UI cập nhật. Hai máy không gửi dữ liệu trực tiếp cho nhau mà cùng dùng Firestore làm backend chia sẻ.

**8. Week 7 đã ngăn double booking chưa? Vì sao?**
Chưa. Realtime không tự giải quyết race condition: hai client có thể cùng ghi booking cho cùng phòng và cùng slot.
