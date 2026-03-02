package com.logistics;

import com.logistics.entity.Connection;
import com.logistics.entity.Location;
import com.logistics.entity.Province;
import com.logistics.repository.ConnectionRepository;
import com.logistics.repository.LocationRepository;
import com.logistics.repository.ProvinceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            ProvinceRepository provinceRepo,
            LocationRepository locationRepo,
            ConnectionRepository connectionRepo) {
        return args -> {
            // Kiểm tra nếu đã có dữ liệu thì không nạp lại
            if (provinceRepo.count() > 0) {
                System.out.println("⚠️ Database đã có dữ liệu. Bỏ qua bước nạp mẫu.");
                return;
            }

            System.out.println("⏳ Đang nạp dữ liệu mẫu...");

            // 1. TẠO TỈNH
            Province p1 = provinceRepo.save(new Province(null, "Hà Nội", "HN", "Bắc"));
            Province p2 = provinceRepo.save(new Province(null, "Đà Nẵng", "DN", "Trung"));
            Province p3 = provinceRepo.save(new Province(null, "TP.HCM", "SG", "Nam"));

            // 2. TẠO KHO (Dùng Setter cho an toàn tuyệt đối)
            Location locHN = new Location();
            locHN.setName("Kho Nội Bài"); 
            locHN.setCode("KNB"); 
            locHN.setProvince(p1);
            locHN = locationRepo.save(locHN); // Lưu và lấy lại ID

            Location locDN = new Location();
            locDN.setName("Cảng Tiên Sa"); 
            locDN.setCode("CTS"); 
            locDN.setProvince(p2);
            locDN = locationRepo.save(locDN);

            Location locHCM = new Location();
            locHCM.setName("Kho Tân Bình"); 
            locHCM.setCode("KTB"); 
            locHCM.setProvince(p3);
            locHCM = locationRepo.save(locHCM);

            // 3. TẠO TUYẾN ĐƯỜNG (CONNECTION)
            // Tuyến 1: Hà Nội -> Đà Nẵng
            Connection c1 = new Connection();
            c1.setFromLocation(locHN);
            c1.setToLocation(locDN);
            c1.setDistanceKm(760.0);
            c1.setPrice(760000.0);
            c1.setTransportType("ROAD");
            connectionRepo.save(c1);

            // Tuyến 2: Đà Nẵng -> HCM
            Connection c2 = new Connection();
            c2.setFromLocation(locDN);
            c2.setToLocation(locHCM);
            c2.setDistanceKm(960.0);
            c2.setPrice(960000.0);
            c2.setTransportType("SEA");
            connectionRepo.save(c2);
            
            // Tuyến 3: HCM -> Hà Nội (Vòng về)
            Connection c3 = new Connection();
            c3.setFromLocation(locHCM);
            c3.setToLocation(locHN);
            c3.setDistanceKm(1720.0);
            c3.setPrice(1500000.0);
            c3.setTransportType("AIR");
            connectionRepo.save(c3);

            System.out.println("✅ Đã nạp xong: 3 Tỉnh - 3 Kho - 3 Tuyến đường!");
        };
    }
}