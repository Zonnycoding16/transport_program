package com.logistics.service;

import com.logistics.entity.Location;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class RouteService {

    // 1. Định nghĩa Node (Toa tàu)
    // Class này nằm bên trong Service vì chỉ mình ông Service cần dùng nó
    private class Node {
        Location data; // Dữ liệu địa điểm
        Node next;     // Con trỏ trỏ tới thằng tiếp theo

        public Node(Location data) {
            this.data = data;
        }
    }

    private Node head = null; // Đầu tàu
    private Node tail = null; // Đuôi tàu

    // 2. Thuật toán thêm địa điểm vào vòng tròn (Add Node)
    public void addLocation(Location location) {
        Node newNode = new Node(location);

        if (head == null) {
            // Nếu tàu chưa có toa nào
            head = newNode;
            tail = newNode;
            newNode.next = head; // Tự trỏ về chính mình (Vòng tròn 1 điểm)
        } else {
            // Nếu đã có toa, nối vào đuôi
            tail.next = newNode; // Đuôi cũ móc vào toa mới
            tail = newNode;      // Cập nhật đuôi mới là toa này
            tail.next = head;    // QUAN TRỌNG: Đuôi mới móc ngược về đầu (Khép vòng)
        }
    }

    // 3. Thuật toán tìm điểm đến tiếp theo (Core Logic)
    // Input: ID của trạm hiện tại (Ví dụ đang ở Hà Nội)
    // Output: Trạm kế tiếp (Sẽ là Đà Nẵng)
    public Location getNextStop(Long currentLocationId) {
        if (head == null) return null;

        Node current = head;
        // Duyệt danh sách (Traversals)
        do {
            if (current.data.getId().equals(currentLocationId)) {
                return current.next.data; // Tìm thấy! Trả về thằng next
            }
            current = current.next; // Chuyển sang toa sau
        } while (current != head); // Nếu quay lại đầu thì dừng

        return null; // Không tìm thấy trạm này trong tuyến
    }

    // 4. Hàm lấy toàn bộ tuyến đường để xem (Debug)
    public List<Location> getAllStops() {
        List<Location> list = new ArrayList<>();
        if (head == null) return list;

        Node current = head;
        do {
            list.add(current.data);
            current = current.next;
        } while (current != head);
        return list;
    }
}