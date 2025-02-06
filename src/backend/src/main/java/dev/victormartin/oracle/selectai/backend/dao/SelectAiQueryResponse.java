package dev.victormartin.oracle.selectai.backend.dao;

import java.util.List;
import java.util.Map;

public record SelectAiQueryResponse(String prompt, String sqlQuery, List<Map<String, String>> result) {
}
