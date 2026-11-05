package com.telecom.classifier.service;

import com.telecom.classifier.api.dto.ClassificationResult;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MockClassifierServiceTest {
    private final MockClassifierService classifierService = new MockClassifierService();

    @Test
    void identifiesAHighBillConversationDeterministically() {
        ClassificationResult first = classifierService.classify("My bill is high this month.");
        ClassificationResult second = classifierService.classify("My bill is high this month.");

        assertEquals("High Bill", first.category());
        assertEquals(first, second);
        assertEquals("MOCK", first.classifierMode());
        assertEquals("Review required", first.reviewStatus());
        assertTrue(first.modelNotice().contains("not a trained ML model"));
    }

    @Test
    void sendsUnmatchedConversationToOthersForReview() {
        ClassificationResult result = classifierService.classify("I have a question about my account.");

        assertEquals("Others", result.category());
        assertEquals(0.50, result.confidence());
        assertEquals("Review required", result.reviewStatus());
    }
}
