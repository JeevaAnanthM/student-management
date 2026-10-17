package com.studentauth.service;

import com.studentauth.dto.AdminStatsResponse;
import com.studentauth.dto.StudentProfileResponse;

import java.util.List;

public interface StudentService {

    StudentProfileResponse getStudentProfileByEmail(String email);

    List<StudentProfileResponse> getAllStudents(String search);

    AdminStatsResponse getAdminStats();
}
