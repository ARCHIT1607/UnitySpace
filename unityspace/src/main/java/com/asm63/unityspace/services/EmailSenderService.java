package com.asm63.unityspace.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String to;

    public String getGoogleMapsUrl(double longitude,double latitude) {
        String marker = String.format("markers=color:red%%7Clabel:S%%7C%s,%s", latitude, longitude);
        return String.format("https://www.google.com/maps?q=%f,%f&key=%s", latitude,longitude,
                marker, "AIzaSyCBHQ2PytqvWuk1RcoWshj57oxZf12l9yM");

    }

    public void sendEmailWithGoogleMapsUrl(double longitude,double latitude,String from) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        System.out.println("from "+from);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(from+" Emergency Location");
        String googleMapsUrl = getGoogleMapsUrl(longitude,latitude);

        String emailBody = String.format("<h1>Google Maps URL</h1><a href=\"%s\">Click here to view the location on Google Maps</a>", googleMapsUrl);
        helper.setText(emailBody, true);

        mailSender.send(message);
    }

    public ResponseEntity sendEmailWithAttachment(MultipartFile file,String from) throws IOException, MessagingException {

        // Attach the file to the email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject("voice note from "+from);
        helper.setText("attachment");
        helper.addAttachment(file.getOriginalFilename(), new ByteArrayResource(file.getBytes()));
        // Send the email
        mailSender.send(message);

        return ResponseEntity.ok("Email sent with attachment");
    }
}