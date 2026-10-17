package com.studentauth.dto;

public class AdminStatsResponse {

    private long totalStudents;
    private long totalAdmins;
    private String systemStatus;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalStudents, long totalAdmins, String systemStatus) {
        this.totalStudents = totalStudents;
        this.totalAdmins = totalAdmins;
        this.systemStatus = systemStatus;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public String getSystemStatus() {
        return systemStatus;
    }

    public void setSystemStatus(String systemStatus) {
        this.systemStatus = systemStatus;
    }
}
