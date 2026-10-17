package com.studentauth.service;

import com.studentauth.dto.AuthResponse;
import com.studentauth.dto.LoginRequest;
import com.studentauth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
