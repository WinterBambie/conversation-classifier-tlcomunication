package com.telecom.classifier.api.dto;

public record ClassificationResult(
        String category,
        double confidence,
        String reviewStatus,
        String classifierMode,
        String modelNotice
) {
}
