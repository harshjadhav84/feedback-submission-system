package com.colon.Feedback.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.colon.Feedback.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
