package com.asm63.unityspace.services;

import com.asm63.unityspace.mappers.StudentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class StreamingService {

    private static final String FORMAT="classpath:videos/%s.mp4";

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private StudentMapper studentMapper;

    public Mono<Resource> getVideo(String title){
        return Mono.fromSupplier(()->new ByteArrayResource(studentMapper.getResource(title).getPicture()));
    }
}
