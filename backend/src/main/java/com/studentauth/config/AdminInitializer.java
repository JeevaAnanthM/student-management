package com.studentauth.config;

import com.studentauth.entity.Student;
import com.studentauth.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminInitializer(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            logger.warn("ADMIN_EMAIL or ADMIN_PASSWORD is not configured in environment. Admin account seeding skipped.");
            return;
        }

        String normalizedEmail = adminEmail.trim().toLowerCase();
        Optional<Student> existingAdmin = studentRepository.findByEmail(normalizedEmail);

        if (existingAdmin.isEmpty()) {
            Student admin = new Student();
            admin.setName("System Administrator");
            admin.setEmail(normalizedEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            admin.setCreatedAt(LocalDateTime.now());

            studentRepository.save(admin);
            logger.info("=================================================================");
            logger.info("Admin account initialized successfully for: {}", normalizedEmail);
            logger.info("=================================================================");
        } else {
            logger.info("Admin account already exists for {}. Preserving existing record without modification.", normalizedEmail);
        }
    }
}
