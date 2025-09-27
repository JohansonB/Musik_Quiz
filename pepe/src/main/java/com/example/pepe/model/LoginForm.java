package com.example.pepe.model;

public class LoginForm {
    private String username;
    private String password;

    // Default constructor
    public LoginForm() {
    }

    // Parameterized constructor
    public LoginForm(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getter and setter methods
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}