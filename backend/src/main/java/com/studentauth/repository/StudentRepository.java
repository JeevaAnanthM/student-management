package com.studentauth.repository;

import com.studentauth.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(String role);

    @Query("SELECT s FROM Student s WHERE s.role = 'STUDENT' AND (:search IS NULL OR :search = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%'))) ORDER BY s.createdAt DESC")
    List<Student> searchStudents(@Param("search") String search);

    List<Student> findByRoleOrderByCreatedAtDesc(String role);
}
