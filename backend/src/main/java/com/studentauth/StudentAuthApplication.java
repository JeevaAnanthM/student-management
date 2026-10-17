package com.studentauth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class StudentAuthApplication {

    private static final Logger logger = LoggerFactory.getLogger(StudentAuthApplication.class);

    public static void main(String[] args) {
        // Load .env configuration into System properties prior to Spring initialization
        loadDotenv();

        SpringApplication.run(StudentAuthApplication.class, args);
    }

    private static void loadDotenv() {
        String[] possiblePaths = {".env", "./backend/.env", "../.env", "../backend/.env"};
        for (String path : possiblePaths) {
            File envFile = new File(path);
            if (envFile.exists() && envFile.isFile()) {
                logger.info("Found .env file at: {}", envFile.getAbsolutePath());
                try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int equalIndex = line.indexOf('=');
                        if (equalIndex > 0) {
                            String key = line.substring(0, equalIndex).trim();
                            String value = line.substring(equalIndex + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                    logger.info("Successfully loaded environment variables from: {}", envFile.getAbsolutePath());
                    return;
                } catch (IOException e) {
                    logger.warn("Failed to read .env file at {}: {}", path, e.getMessage());
                }
            }
        }
        logger.info("No .env file found in standard locations. Using system environment variables and application.properties defaults.");
    }
}
