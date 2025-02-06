package dev.victormartin.oracle.selectai.backend.repository;

import org.springframework.stereotype.Repository;

import java.util.Map;

public interface SelectAiRepository {
    Map<String, String> runSql(String query);
}
