package com.asm63.unityspace.controllers;

import com.asm63.unityspace.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping("/dashboard/createEvent")
    public ResponseEntity<?> createEvent(
            @RequestParam(name = "eventName") String eventName, @RequestParam(name = "eventDate") String eventDate) {
        try {
            System.out.println("calling createEvent");
            eventService.createEvent(eventName, eventDate);
            return new ResponseEntity<>(eventService.getEvents(),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }

    }

    @PostMapping("/dashboard/deleteEvent")
    public ResponseEntity<?> deleteEvent(
            @RequestParam(name = "eventId") String id) {
        try {
            System.out.println("calling deleteEvent");
            eventService.deleteEvent(id);
            return new ResponseEntity<>(eventService.getEvents(),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }

    }
}
