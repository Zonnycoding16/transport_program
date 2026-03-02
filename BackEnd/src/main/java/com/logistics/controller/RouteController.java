package com.logistics.controller;

import com.logistics.entity.Location;
import com.logistics.service.CostCalculator;
import com.logistics.service.RouteService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/route")
@CrossOrigin(origins = "*")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @Autowired
    private CostCalculator costCalculator;

    // --- SỬA LỖI TẠI ĐÂY: Dùng Setter thay vì Constructor ---
    @PostConstruct
    public void initRoute() {
        // Tạo dữ liệu giả để chạy thuật toán vòng tròn (Không ảnh hưởng đến DB)
        Location hn = new Location(); 
        hn.setId(1L); 
        hn.setName("Hà Nội");

        Location dn = new Location(); 
        dn.setId(2L); 
        dn.setName("Đà Nẵng");

        Location hcm = new Location(); 
        hcm.setId(3L); 
        hcm.setName("TP.HCM");

        // Nạp vào thuật toán Circular Linked List
        routeService.addLocation(hn);
        routeService.addLocation(dn);
        routeService.addLocation(hcm);
        
        System.out.println("✅ Đã khởi tạo thuật toán Linked List!");
    }

    // --- API 1: Xem toàn bộ tuyến đường ---
    @GetMapping
    public List<Location> getFullRoute() {
        return routeService.getAllStops();
    }

    // --- API 2: Tìm trạm kế tiếp ---
    @GetMapping("/next/{currentId}")
    public Location getNextStop(@PathVariable Long currentId) {
        return routeService.getNextStop(currentId);
    }

    // --- API 3: Tính tiền (Lấy dữ liệu thật từ DB) ---
    @GetMapping("/cost")
    public Map<String, Object> calculateCost(
            @RequestParam Long from, 
            @RequestParam Long to) {
        
        double distance = costCalculator.getDistance(from, to);
        double money = costCalculator.calculateShippingCost(from, to);

        return Map.of(
            "distance_km", distance,
            "total_price_vnd", money,
            "message", distance > 0 ? "Thành công!" : "Không tìm thấy tuyến đường này"
        );
    }
}