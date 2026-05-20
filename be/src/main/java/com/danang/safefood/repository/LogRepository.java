package com.danang.safefood.repository;

import com.danang.safefood.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, String> {
}
