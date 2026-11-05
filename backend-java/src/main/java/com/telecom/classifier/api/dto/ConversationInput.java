package com.telecom.classifier.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConversationInput(
        @NotBlank(message = "Message must not be blank.")
        @Size(max = 10_000, message = "Message must not exceed 10,000 characters.")
        String message
) {
}
