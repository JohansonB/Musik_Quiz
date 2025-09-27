package com.example.pepe.model;

public class Login_Error extends Exception {
    protected String message;
    public String get_message(){
        return message;
    }
}
