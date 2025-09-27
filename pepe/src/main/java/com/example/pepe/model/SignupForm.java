package com.example.pepe.model;

public class SignupForm {
    private String username;
    private String password;

    private String klasse;

    // Default constructor
    public SignupForm() {
    }

    // Parameterized constructor
    public SignupForm(String username, String password,String klasse) {
        this.username = username;
        this.password = password;
        this.klasse = klasse;
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
    public String getKlasse(){
        return klasse;
    }
    public void setKlasse(String klasse){
        this.klasse = klasse;
    }

}
