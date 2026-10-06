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
