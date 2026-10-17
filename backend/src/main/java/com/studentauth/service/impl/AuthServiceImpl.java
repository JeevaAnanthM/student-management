package com.studentauth.service.impl;

import com.studentauth.dto.AuthResponse;
import com.studentauth.dto.LoginRequest;
import com.studentauth.dto.RegisterRequest;
import com.studentauth.entity.Student;
import com.studentauth.exception.DuplicateEmailException;
import com.studentauth.exception.PasswordMismatchException;
import com.studentauth.repository.StudentRepository;
import com.studentauth.security.CustomUserDetails;
import com.studentauth.security.JwtUtils;
import com.studentauth.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Value("${app.admin.email}")
    private String configuredAdminEmail;

    public AuthServiceImpl(
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        // 1. Password confirmation check
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new PasswordMismatchException("Password and confirm password do not match");
        }

        // 2. Reserved administrator email check
        if (configuredAdminEmail != null && normalizedEmail.equalsIgnoreCase(configuredAdminEmail.trim())) {
            throw new DuplicateEmailException("This email address cannot be registered");
        }

        // 3. Duplicate email check in database
        if (studentRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateEmailException("An account with email " + normalizedEmail + " already exists");
        }

        // 4. Create and save student entity (strictly assigning role = 'STUDENT')
        Student student = new Student();
        student.setName(request.getName().trim());
        student.setEmail(normalizedEmail);
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setRole("STUDENT"); // ALWAYS STUDENT, never accepted from user input
        student.setCreatedAt(LocalDateTime.now());

        Student savedStudent = studentRepository.save(student);

        // 5. Generate token for immediate seamless login upon registration
        String token = jwtUtils.generateToken(
                savedStudent.getId(),
                savedStudent.getEmail(),
                savedStudent.getName(),
                savedStudent.getRole()
        );

        return new AuthResponse(
                token,
                savedStudent.getId(),
                savedStudent.getName(),
                savedStudent.getEmail(),
                savedStudent.getRole(),
                "Student registration successful"
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        // Authenticate using Spring Security AuthenticationManager (handles BCrypt password comparison)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Generate signed JWT token
        String token = jwtUtils.generateToken(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getName(),
                userDetails.getRole()
        );

        return new AuthResponse(
                token,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername(),
                userDetails.getRole(),
                "Authentication successful"
        );
    }
}
