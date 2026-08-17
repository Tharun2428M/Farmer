package com.farmersmarket.dto;

import java.math.BigDecimal;

public class AdminChartDataPointDto {
    private String label;
    private double value;
    private double secondaryValue;
    private String category;

    public AdminChartDataPointDto() {
    }

    public AdminChartDataPointDto(String label, double value) {
        this.label = label;
        this.value = value;
    }

    public AdminChartDataPointDto(String label, double value, double secondaryValue) {
        this.label = label;
        this.value = value;
        this.secondaryValue = secondaryValue;
    }

    public AdminChartDataPointDto(String label, double value, double secondaryValue, String category) {
        this.label = label;
        this.value = value;
        this.secondaryValue = secondaryValue;
        this.category = category;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public double getSecondaryValue() {
        return secondaryValue;
    }

    public void setSecondaryValue(double secondaryValue) {
        this.secondaryValue = secondaryValue;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
