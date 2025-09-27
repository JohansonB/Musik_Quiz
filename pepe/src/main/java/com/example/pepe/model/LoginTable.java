package com.example.pepe.model;

import com.example.pepe.String_Sequence_Encoder;
import com.example.pepe.Tuple;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;

public class LoginTable {
    static ReentrantLock class_lock = new ReentrantLock();
    private static LoginTable instance = null;

    private LoginTable(){

    }

    public static LoginTable getInstance(){
        if(instance==null){
            class_lock.lock();
            try {
                if (instance == null)
                    instance = load();
            }
            finally {
                class_lock.unlock();
            }


        }
        return instance;
    }

    //the Username-Password tuples are mapped to the session id;
    HashMap<Tuple<String,String>,Long>  login_table = new HashMap<>();
    HashMap<String,String> session_info = new HashMap<>();

    public boolean contains_user(String user){
        AtomicBoolean contains = new AtomicBoolean(false);
        login_table.forEach((uAndp,id)->{
            if(uAndp.ele1.equalsIgnoreCase(user.trim())){
                contains.set(true);
            }
        });
        return contains.get();
    }
    public void delete_user(String username){
        AtomicReference<Tuple<String, String>> target = new AtomicReference<>();
        login_table.forEach((k,v)->{
            if(k.ele1.equals(username)){
                target.set(k);
            }
        });
        Long debugg = login_table.remove(target.get());
        store();
    }

    public boolean valid(String username,String password){
        Tuple<String,String> tuple = new Tuple<>(username.trim(),password);
        AtomicBoolean contains = new AtomicBoolean(false);
        login_table.forEach((uAndp,id)->{
            if(uAndp.equals(tuple)){
                contains.set(true);
            }
        });
        return contains.get();

    }

    //logs the user in by generating a new session id for the user and returning it;
    //incase the user credentials are incorrect, explanatory Exceptions are thrown
    public long login(String username, String password) throws Login_Error{
        if(valid(username,password)){
            SecureRandom secureRandom = new SecureRandom();
            long id = Math.abs(secureRandom.nextLong());
            login_table.put(new Tuple<>(username,password),id);
            session_info.put(username,Long.toString(id));
            return id;
        }
        else{
            if(!contains_user(username))
                throw new Wrong_Username();

            else
                throw new Wrong_Password();
        }

    }
    //sign up a new User.
    //Throws an exception when the username is allready used
    public long sign_up(String user, String password) throws Signup_Error{
        if(contains_user(user)){
            throw new Signup_Error();
        }
        else{
            SecureRandom secureRandom = new SecureRandom();
            long id = Math.abs(secureRandom.nextLong());
            login_table.put(new Tuple<>(user,password),id);
            session_info.put(user,Long.toString(id));
            store();
            return id;
        }

    }

    public boolean authorized(String username, String id){
        if(!session_info.containsKey(username)){
            return false;
        }
        return session_info.get(username).equals(id);
    }
    boolean validate_session(String username, Long id){
        if(id ==-1){
            return false;
        }
        AtomicBoolean contains = new AtomicBoolean(false);
        Tuple<String,Long> tuple = new Tuple<>(username,id);
        login_table.forEach((uAndp, ze_id)->{

            if(tuple.equals(new Tuple<>(uAndp.ele1,ze_id))){
                contains.set(true);
            }
        });
        return contains.get();
    }
    static synchronized LoginTable load(){
        String dataDirectory = "data/passwords/";  // Change this to your desired directory
        String filePath = dataDirectory +"passwords.txt";
        File file = new File(filePath);

        LoginTable ret = new LoginTable();
        try {
            String fileContent = new String(Files.readAllBytes(Paths.get(file.getPath())));
            ArrayList<String> code = String_Sequence_Encoder.decode(fileContent);
            if(code.size()==0){
                return ret;
            }
            String last = code.get(0);
            for(int i = 1; i<code.size();i++){
                if(i%2==1){
                    ret.login_table.put(new Tuple<>(last,code.get(i)),Long.valueOf(-1));
                }
                else{
                    last =code.get(i);
                }

            }


        } catch (IOException e) {
            System.out.println(e.getStackTrace());
            System.exit(-1);
        }

        return ret;

    }

    public synchronized void store(){
        String dataDirectory = "data/passwords/";  // Change this to your desired directory
        String filePath = dataDirectory +"passwords.txt";
        File file = new File(filePath);

        try{
            BufferedWriter writer = new BufferedWriter(new FileWriter(file));
            ArrayList<String> tot= new ArrayList<>();
            for (Map.Entry<Tuple<String, String>, Long> entry : login_table.entrySet()) {
                Tuple<String, String> uAndp = entry.getKey();
                tot.add(uAndp.ele1);
                tot.add(uAndp.ele2);
            }
            writer.write(String_Sequence_Encoder.encoding(tot));
            writer.flush();
            writer.close();
        } catch (IOException e) {
            System.out.println(e.getStackTrace());
            System.exit(-1);
        }
    }

}
