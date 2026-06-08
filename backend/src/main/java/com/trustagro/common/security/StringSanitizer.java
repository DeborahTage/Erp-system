package com.trustagro.common.security;

import java.text.Normalizer;

public final class StringSanitizer {

    private StringSanitizer() {
    }

    public static String sanitize(String input) {
        if (input == null) {
            return null;
        }

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFKC)
                .replace('\u0000', ' ')
                .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", " ")
                .replaceAll("(?is)<[^>]*>", " ")
                .replace("<", " ")
                .replace(">", " ")
                .replaceAll("[ \\t\\x0B\\f\\r]+", " ")
                .replaceAll("\\n{3,}", "\n\n")
                .trim();

        return normalized.isBlank() ? null : normalized;
    }
}
