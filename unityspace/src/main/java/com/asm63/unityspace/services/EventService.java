package com.asm63.unityspace.services;

import com.asm63.unityspace.mappers.PostMapper;
import com.asm63.unityspace.models.Events;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;

@Service
public class EventService {

    @Autowired
    private PostMapper postMapper;
    public void createEvent(String eventName, String eventDate) {
        Events event = new Events();
        event.setEventName(eventName);
        event.setEventDate(eventDate);
        event.setDaysLeft("");
        event.setActive(true);
        event.setCreatedDate(LocalDate.now().toString());
        postMapper.createEvent(event);
    }

    public ArrayList<Events> getEvents() {
       return postMapper.getEvents();
    }

    public void deleteEvent(String id) {
        postMapper.deleteEvent(Long.parseLong(id));
    }
}
