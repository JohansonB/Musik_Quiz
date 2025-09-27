package com.example.pepe.Controller;
import com.example.pepe.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class LoginController {
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);



    @RequestMapping("/start")
    public String loginPage() {
        return "index";
    }

    @RequestMapping("/main")
    public String mainPage() {
        return "main2";
    }

    @RequestMapping("/load_view")
    public  ResponseEntity<Map<String, String>> load_view() {
        Map map = new HashMap();
        map.put("sequence",User_Storage.getInstance().level_overview());
        return ResponseEntity.ok(map);
    }
    @RequestMapping("/navigation")
    public String viewPage(){
        return "navigation";}


    @RequestMapping("/final")
    public String finalPage(){return "final";}

    @PostMapping("/update-state") // Replace with your actual endpoint URL
    public ResponseEntity<String> receiveData(@RequestBody Map<String, String> sessionData) {
        // Handle the received data
        // You can access the data as a Map<String, String>

        // For example, you can print the data to the console
        User_Storage storage = User_Storage.getInstance();
        LoginTable loginTable = LoginTable.getInstance();
        String username = sessionData.remove("username");
        String session_id = sessionData.remove("sessionID");
        if(username==null||session_id==null||!loginTable.authorized(username,session_id)){
            return new ResponseEntity<>("buuuuh",HttpStatus.BAD_REQUEST);
        }
        storage.update_profile(username,sessionData);

        return ResponseEntity.ok("Data received and processed successfully.");
    }
    @PostMapping("/user_data")
    public ResponseEntity<HashMap<String,String>> get_user_data(@RequestBody String username){
        HashMap<String,String> ret = new HashMap<>();
        if(!LoginTable.getInstance().contains_user(username)){
            ret.put("error","no such user in da base");
            return new ResponseEntity<>(ret,HttpStatus.BAD_REQUEST);
        }
        User_Storage u_s = User_Storage.getInstance();
        HashMap<String,String> u_d = u_s.get_profile(username);
        u_d.forEach((k,v)->{if(k.contains("posten"))ret.put(k,v);});
        return ResponseEntity.ok(ret);
    }
    @PostMapping("/user_results")
    public ResponseEntity<HashMap<String,String>> get_user_results(@RequestBody String username){
        HashMap<String,String> ret = new HashMap<>();
        if(!LoginTable.getInstance().contains_user(username)){
            ret.put("error","no such user in da base");
            return new ResponseEntity<>(ret,HttpStatus.BAD_REQUEST);
        }
        User_Storage u_s = User_Storage.getInstance();
        HashMap<String,String> u_d = u_s.get_profile(username);
        User_Profile u_p = new User_Profile(u_d);
        return ResponseEntity.ok(u_p.new Results_Tree().get_results());
    }
    @PostMapping("/user_analysis")
    public ResponseEntity<HashMap<String,String>> get_user_analysis(@RequestBody String username){
        HashMap<String,String> ret = new HashMap<>();
        if(!LoginTable.getInstance().contains_user(username)){
            ret.put("error","no such user in da base");
            return new ResponseEntity<>(ret,HttpStatus.BAD_REQUEST);
        }
        User_Storage u_s = User_Storage.getInstance();
        HashMap<String,String> u_d = u_s.get_profile(username);
        User_Profile u_p = new User_Profile(u_d);
        return ResponseEntity.ok(u_p.new Results_Tree().get_analysis());
    }
    @PostMapping("/delete")
    public ResponseEntity<Void> delete(@RequestBody String username){
        User_Storage.getInstance().delete_profile(username);
        LoginTable.getInstance().delete_user(username);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/login")
    public  ResponseEntity<Map<String, String>> login(@RequestBody LoginForm loginForm) {
        // Assuming LoginForm is a class representing your login form data
        String username = loginForm.getUsername();
        String password = loginForm.getPassword();
        long id;
        User_Storage u_s= User_Storage.getInstance();
        Map<String,String> ret = new HashMap<>();
        LoginTable loginTable = LoginTable.getInstance();
        try {
            id = loginTable.login(username, password);
            ret = new HashMap<>();
            //ret.putAll(u_s.get_profile(username));
            HashMap<String,String> profile = u_s.get_profile(username);
            if(profile.containsKey("p1l1mode")){
                ret.put("p1l1mode",profile.get("p1l1mode"));
            }
            if(profile.containsKey("sequence")){
                ret.put("sequence",profile.get("sequence"));
            }

            ret.put("username",username);
            ret.put("sessionID",Long.toString(id));
            return ResponseEntity.ok(ret);
        } catch (Login_Error e) {
            ret.put("error",e.get_message());
            return new ResponseEntity<>(ret, HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String,String>> signup(@RequestBody SignupForm signupForm) {
        // Assuming SignupForm is a class representing your signup form data
        String username = signupForm.getUsername();
        String password = signupForm.getPassword();
        String klasse = signupForm.getKlasse();
        User_Storage u_s= User_Storage.getInstance();
        u_s.update_profile(username,"klasse",klasse);
        Map<String,String> ret = new HashMap<>();
        long id;
        LoginTable loginTable = LoginTable.getInstance();
        try{
            id = loginTable.sign_up(username,password);
            ret = u_s.get_profile(username);
            u_s.update_metadata(username,klasse);
            ret.put("username",username);
            ret.put("sessionID",Long.toString(id));
            return ResponseEntity.ok(ret);
        } catch (Signup_Error e) {
            ret.put("error",e.msg);
            return new ResponseEntity<>(ret,HttpStatus.BAD_REQUEST);
        }

    }
    @PostMapping("/auswertung_data")
    public ResponseEntity<Map<String, String>> auswertung_data() {
        // Create a HashMap with the data you want to send to the client
        User_Storage u_s = User_Storage.getInstance();
        HashMap<String,String> metadata = u_s.meta_data();

        return ResponseEntity.ok(metadata);
    }
    @GetMapping("/auswertung")
    public String auswertung() {
        // Assuming your HTML pages are stored in a folder named "pages" within your resources directory
        // For example, "page1.html" would be stored in "src/main/resources/pages/page1.html"
        return "auswertung"; // This returns the HTML page's name to be resolved by a ViewResolver
    }

    @GetMapping("/pages/{pageName}")
    public String loadPage(@PathVariable String pageName) {
        // Assuming your HTML pages are stored in a folder named "pages" within your resources directory
        // For example, "page1.html" would be stored in "src/main/resources/pages/page1.html"
        return "pages/" + pageName; // This returns the HTML page's name to be resolved by a ViewResolver
    }
}