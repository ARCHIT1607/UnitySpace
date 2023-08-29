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
import java.net.URL;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String to;

    public void sendEmailWithGoogleMaps(String recipientEmail) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("confusedDeveloper97@gmail.com");
        helper.setTo("confusedDeveloper97@gmail.com");
        helper.setSubject("Google Maps Image");

        // Use the Google Maps Static API to retrieve a map image
        String location = "LE15SP";
        String apiKey = "AIzaSyCBHQ2PytqvWuk1RcoWshj57oxZf12l9yM";
        String imageUrl = String.format("https://maps.googleapis.com/maps/api/staticmap?center=%s&zoom=15&size=600x400&maptype=roadmap&markers=color:red%%7C%s&key=%s", location, location, apiKey);
        URL url = new URL(imageUrl);

        // Create the email body with the map image
        String emailBody = "<h1>Google Maps Image</h1><img src=\"cid:mapImage\">";
        helper.setText(emailBody, true);
        helper.setSubject(String.format("https://maps.googleapis.com/maps/api/staticmap" +
                "?center=%s&zoom=30&size=600x400&maptype=roadmap&markers=color:red%%7C%s&key=%s", location, location, apiKey));
        byte[] imageData = url.openStream().readAllBytes();
        // Create a ByteArrayResource with the image data
        ByteArrayResource imageResource = new ByteArrayResource(imageData);
        // Add the map image as an inline attachment
        helper.addInline("mapImage", imageResource, "image/png");
        mailSender.send(message);
    }

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