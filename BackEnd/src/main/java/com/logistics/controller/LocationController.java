package com.logistics.controller;

import com.logistics.entity.Location;
import com.logistics.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class LocationController {

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping("/api/locations")
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }
}