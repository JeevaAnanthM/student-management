package com.studentauth.service.impl;

import com.studentauth.dto.AdminStatsResponse;
import com.studentauth.dto.StudentProfileResponse;
import com.studentauth.entity.Student;
import com.studentauth.exception.ResourceNotFoundException;
import com.studentauth.repository.StudentRepository;
import com.studentauth.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public StudentProfileResponse getStudentProfileByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));

        return mapToProfileResponse(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentProfileResponse> getAllStudents(String search) {
        List<Student> students;
        if (search != null && !search.trim().isEmpty()) {
            students = studentRepository.searchStudents(search.trim());
        } else {
            students = studentRepository.findByRoleOrderByCreatedAtDesc("STUDENT");
        }

        return students.stream()
                .map(this::mapToProfileResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsResponse getAdminStats() {
        long totalStudents = studentRepository.countByRole("STUDENT");
        long totalAdmins = studentRepository.countByRole("ADMIN");

        return new AdminStatsResponse(totalStudents, totalAdmins, "HEALTHY");
    }

    private StudentProfileResponse mapToProfileResponse(Student student) {
        return new StudentProfileResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getRole(),
                student.getCreatedAt()
        );
    }
}
