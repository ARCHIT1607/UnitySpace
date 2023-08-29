package com.asm63.unityspace.controllers;

import com.asm63.unityspace.models.Student;
import com.asm63.unityspace.services.EmailSenderService;
import com.asm63.unityspace.services.StudentService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin
public class AuthController {
    @Autowired
    private StudentService studService;

    @Autowired
    PasswordEncoder passwordEncode;

    @Autowired
    EmailSenderService service;

    @PostMapping(value = "/auth/register")
    public ResponseEntity<Object> register(@RequestParam("fname") String fname, @RequestParam("lname") String lname,
                                           @RequestParam("sid") String sid, @RequestParam("email") String email,
                                           @RequestParam("password") String password, @RequestParam("loc") String loc,
                                           @RequestParam("course") String course,
                                           @RequestParam(value = "picture", required = false) MultipartFile picture) throws Exception {
        try {
            Student student = new Student();
            student.setFname(fname);
            student.setLname(lname);
            student.setSid(sid);
            student.setEmail(email);
            student.setPassword(password);
            student.setLoc(loc);
            student.setCourse(course);
            Student user = studService.findByEmail(student.getEmail());
            List<HashMap> allStudent = studService.findAllStudent();
            System.out.println("picture" + picture);
            System.out.println("student id exists " + allStudent.stream()
                    .anyMatch(studentId -> studentId.containsValue(sid)));
            if (allStudent.stream()
                    .anyMatch(studentId -> studentId.containsValue(sid))) {
                throw new Exception("user with similar student id already exists");
            }
            if (user != null && user.getEmail().toUpperCase().equals(student.getEmail().toUpperCase())) {
                throw new Exception("user already exists");
            }
            student.setPassword(passwordEncode.encode(student.getPassword()));
            System.out.println("Student " + student);
            return new ResponseEntity<Object>(studService.register(student, picture), HttpStatus.OK);
        } catch (Exception e) {
            HashMap<Object, Object> map = new HashMap<>();
            if (e.getMessage().equals("user already exists")) {
                map.put("errorMsg", e.getMessage());
                map.put("errorType", "user_exists");
            } else {
                e.printStackTrace();
                map.put("errorMsg", e.getMessage());
            }
            return new ResponseEntity<Object>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Object> getUserDetails(@RequestParam(name = "email") String email,
                                                 @RequestParam(name = "password") String password) {
        Student user = studService.findByEmail(email);
        System.out.println("Student " + user);
        try {
            if (user == null) {
                throw new Exception("Student doesn't Exist");
            } else if (passwordEncode.matches(password, user.getPassword())) {
                System.out.println("pass is correct");

                return new ResponseEntity<Object>(studService.authenticate(user), HttpStatus.OK);
            } else {
                HashMap<Object, Object> map = new HashMap<>();
                map.put("errorMsg", "Password is incorrect");
                map.put("errorType", "password_not_found");
                return new ResponseEntity<Object>(map, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            HashMap<Object, Object> map = new HashMap<>();

            if (e.getMessage().equals("User doesn't Exist")) {
                map.put("errorMsg", e.getMessage());
                map.put("errorType", "user_not_found");
            } else {
                map.put("errorMsg", e.getMessage());
            }
            return new ResponseEntity<Object>(map, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/user/image/{picturePath}", produces = MediaType.IMAGE_JPEG_VALUE)
    public void downloadImage(@PathVariable("picturePath") String picturePath, HttpServletResponse response) throws IOException {
        InputStream resource = studService.getResource(picturePath);
        response.setContentType(MediaType.IMAGE_JPEG_VALUE);
        StreamUtils.copy(resource, response.getOutputStream());

    }

    @GetMapping("/auth/test")
    public void test() throws MessagingException, IOException {
        service.sendEmailWithGoogleMaps("");
    }

    @PostMapping("/auth/emergencyCall")
    public void emergencyCall(@RequestParam("longitude") String longitude,
                      @RequestParam("latitude") String latitude,@RequestParam("from") String to) throws MessagingException, IOException {
        service.sendEmailWithGoogleMapsUrl(Double.parseDouble(longitude),Double.parseDouble(latitude),to);
    }

    @PostMapping("/auth/send-email")
    public ResponseEntity<String> sendEmailWithAttachment(@RequestParam("file") MultipartFile file,String to) throws MessagingException, IOException {
        // Save the file to the server
        return service.sendEmailWithAttachment(file,from);

    }



}
