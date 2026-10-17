package com.studentauth.controller;

import com.studentauth.dto.StudentProfileResponse;
import com.studentauth.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/me")
    public ResponseEntity<StudentProfileResponse> getCurrentStudentProfile(Authentication authentication) {
        String email = authentication.getName();
        StudentProfileResponse profile = studentService.getStudentProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }
}
