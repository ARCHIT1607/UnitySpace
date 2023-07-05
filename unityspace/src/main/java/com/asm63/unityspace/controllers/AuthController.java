package com.asm63.unityspace.controllers;

import com.asm63.unityspace.models.LoginDTO;
import com.asm63.unityspace.models.Student;
import com.asm63.unityspace.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@CrossOrigin
public class AuthController {
    @Autowired
    private StudentService studService;

    @Autowired
    PasswordEncoder passwordEncode;
    @PostMapping(value = "/auth/register")
    public ResponseEntity<Object> register(@RequestBody Student student) throws Exception {
        try {
            Student user = studService.findByEmail(student.getEmail());

            if (user != null && user.getEmail().toUpperCase().equals(student.getEmail().toUpperCase())) {
                throw new Exception("user already exists");
            }
            student.setPassword(passwordEncode.encode(student.getPassword()));
            System.out.println("Student "+student);
            return new ResponseEntity<Object>(studService.register(student), HttpStatus.OK);
        } catch (Exception e) {
            HashMap<Object, Object> map = new HashMap<>();
            if(e.getMessage().equals("user already exists")) {
                map.put("errorMsg", e.getMessage());
                map.put("errorType", "user_exists");
            }else {
                e.printStackTrace();
                map.put("errorMsg", e.getMessage());
            }
            return new ResponseEntity<Object>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/auth/login")
//    public ResponseEntity<Object> getUserDetails(@RequestParam(name = "email") String email,
//                                                 @RequestParam(name = "password") String password) {
        public ResponseEntity<Object> login(@RequestBody LoginDTO loggedUser) {
        Student user = studService.findByEmail(loggedUser.getEmail());
        System.out.println("Student " + user);
        try {
            if (user == null) {
                throw new Exception("Student doesn't Exist");
            } else if (passwordEncode.matches(loggedUser.getPassword(), user.getPassword())) {
                System.out.println("pass is correct");

                return new ResponseEntity<Object>(studService.authenticate(user), HttpStatus.OK);
            } else {
                HashMap<Object,Object> map = new HashMap<>();
                map.put("errorMsg", "Password is incorrect");
                map.put("errorType", "password_not_found");
                return new ResponseEntity<Object>(map, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            HashMap<Object,Object> map = new HashMap<>();

            if(e.getMessage().equals("User doesn't Exist")) {
                map.put("errorMsg", e.getMessage());
                map.put("errorType", "user_not_found");
            }else {
                map.put("errorMsg", e.getMessage());
            }
            return new ResponseEntity<Object>(map, HttpStatus.BAD_REQUEST);
        }
    }
}
