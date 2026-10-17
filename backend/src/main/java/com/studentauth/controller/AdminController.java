package com.studentauth.controller;

import com.studentauth.dto.AdminStatsResponse;
import com.studentauth.dto.StudentProfileResponse;
import com.studentauth.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final StudentService studentService;

    public AdminController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentProfileResponse>> getAllStudents(
            @RequestParam(value = "search", required = false) String search) {
        List<StudentProfileResponse> students = studentService.getAllStudents(search);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {
        AdminStatsResponse stats = studentService.getAdminStats();
        return ResponseEntity.ok(stats);
    }
}
