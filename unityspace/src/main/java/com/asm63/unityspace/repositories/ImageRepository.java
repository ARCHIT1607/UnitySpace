package com.asm63.unityspace.repositories;

import com.asm63.unityspace.models.Picture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Picture, Long> {
}
