package com.asm63.unityspace.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {


    private static final long serialVersionUID = 1L;

    private Student user;

    public UserDetailsImpl(Student user) {

        super();
        this.user = user;


    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {


        List<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();
        grantedAuthorities.add(new SimpleGrantedAuthority(this.user.getRole().toUpperCase()));
		System.out.println("inside details impl "+grantedAuthorities.get(0).getAuthority());
        return grantedAuthorities;
    }

    @Override
    public String getPassword() {

        return this.user.getPassword();
    }

    @Override
    public String getUsername() {

        return this.user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {

        return true;
    }

    @Override
    public boolean isAccountNonLocked() {

        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {

        return true;
    }

    @Override
    public boolean isEnabled() {

        return true;
    }

    public Student getUserDetails() {
        return user;
    }

    @Override
    public String toString() {
        return "UserDetailsImpl [user=" + user + "]";
    }
}