package dev.victormartin.oracle.selectai.backend.controller;

import dev.victormartin.oracle.selectai.backend.dao.SelectAiQueryRequest;
import dev.victormartin.oracle.selectai.backend.dao.SelectAiQueryResponse;
import dev.victormartin.oracle.selectai.backend.repository.SelectAiRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class SelectAIController {
    Logger log = LoggerFactory.getLogger(SelectAIController.class);

    @Value("${selectai.profile}")
    private String selectaiProfile;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    SelectAiRepository selectAiRepository;

    @PostMapping("/api/v1.0.0/selectai/query")
    @Transactional
    public SelectAiQueryResponse query(@RequestBody SelectAiQueryRequest request) {
        String prompt = request.prompt();
        log.info("Select AI Query prompt: {}", prompt);

        // get query from Select AI
        String setSelectAiProfileCommand = String.format("BEGIN dbms_cloud_ai.set_profile(profile_name => " +
                "'%s'); END;", selectaiProfile);
        entityManager.createNativeQuery(setSelectAiProfileCommand).executeUpdate();

        prompt=prompt.replaceAll("[;?!\"\']", " ");

        String selectAiShowsql = String.format("SELECT AI showsql %s", prompt);
        String sqlCode = jdbcTemplate.queryForObject(selectAiShowsql, String.class);

        // execute query on database
        List<Map<String, Object>> sqlQueryResultString = jdbcTemplate.queryForList(sqlCode);
        List<Map<String, String>> result = sqlQueryResultString.stream()
                .map(row -> row.entrySet().stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> String.valueOf(entry.getValue())
                        )))
                .collect(Collectors.toList());

        SelectAiQueryResponse response = new SelectAiQueryResponse(prompt, sqlCode,
                result);
        return response;
    }
}
