package com.farmersmarket.dto;

public class SystemHealthDto {
    private String status;
    private String databaseStatus;
    private long databaseLatencyMs;
    private String apiStatus;
    private String appVersion;
    private String environment;
    private long jvmTotalMemoryMb;
    private long jvmFreeMemoryMb;
    private long jvmUsedMemoryMb;
    private long systemUptimeSeconds;

    public SystemHealthDto() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDatabaseStatus() {
        return databaseStatus;
    }

    public void setDatabaseStatus(String databaseStatus) {
        this.databaseStatus = databaseStatus;
    }

    public long getDatabaseLatencyMs() {
        return databaseLatencyMs;
    }

    public void setDatabaseLatencyMs(long databaseLatencyMs) {
        this.databaseLatencyMs = databaseLatencyMs;
    }

    public String getApiStatus() {
        return apiStatus;
    }

    public void setApiStatus(String apiStatus) {
        this.apiStatus = apiStatus;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public long getJvmTotalMemoryMb() {
        return jvmTotalMemoryMb;
    }

    public void setJvmTotalMemoryMb(long jvmTotalMemoryMb) {
        this.jvmTotalMemoryMb = jvmTotalMemoryMb;
    }

    public long getJvmFreeMemoryMb() {
        return jvmFreeMemoryMb;
    }

    public void setJvmFreeMemoryMb(long jvmFreeMemoryMb) {
        this.jvmFreeMemoryMb = jvmFreeMemoryMb;
    }

    public long getJvmUsedMemoryMb() {
        return jvmUsedMemoryMb;
    }

    public void setJvmUsedMemoryMb(long jvmUsedMemoryMb) {
        this.jvmUsedMemoryMb = jvmUsedMemoryMb;
    }

    public long getSystemUptimeSeconds() {
        return systemUptimeSeconds;
    }

    public void setSystemUptimeSeconds(long systemUptimeSeconds) {
        this.systemUptimeSeconds = systemUptimeSeconds;
    }
}
