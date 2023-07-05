package com.asm63.unityspace.services;

import com.asm63.unityspace.mappers.StudentMapper;
import com.asm63.unityspace.models.Student;
import com.asm63.unityspace.models.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private StudentMapper studentMapper;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("Calling findByEmail "+email);

        Student user=studentMapper.findByEmail(email);
        System.out.println("User "+user);
        if(user==null) {
            System.out.println("exception thrown");
            throw new UsernameNotFoundException(email + "not found");
        }
        return new UserDetailsImpl(user);
    }

}
