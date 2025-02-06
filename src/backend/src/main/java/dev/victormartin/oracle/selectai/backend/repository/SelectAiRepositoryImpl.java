package dev.victormartin.oracle.selectai.backend.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class SelectAiRepositoryImpl implements SelectAiRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Map<String, String> runSql(String query) {
        entityManager.createQuery(query, Tuple.class)
                .getResultStream()
                .collect(
                        Collectors.toMap(
                                tuple -> ((String) tuple.get("COM_PRG_PK")),
                                tuple -> ((String) tuple.get("COM_DESCRIZIONE"))
                        ));
        return Map.of();
    }
}
