package com.example.pepe.model;


import com.example.pepe.String_Sequence_Encoder;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

public class User_Storage {
    static ReentrantLock file_lock = new ReentrantLock();
    private static User_Storage instance = null;

    //maps the username to the corresponding userdata which consists of exercise id/solution pairs
    private HashMap<String,HashMap<String,String>>data_table;

    private User_Storage(){

    }


    public static User_Storage getInstance(){
        if(instance==null){
            file_lock.lock();
            try {
                if (instance == null)

                    instance = new User_Storage();
                    instance.data_table = new HashMap<>();
            }
            finally {
                file_lock.unlock();
            }


        }
        return instance;
    }
    public void update_profile(String username, String key, String value){
        get_profile(username).put(key,value);
        store_profile(username);
    }
    public synchronized void synchronize_meta_data(){
        HashMap<String,String> metadata = new HashMap<>();
        String directoryPath = "data/";

        Path directory = Paths.get(directoryPath);

        if (Files.exists(directory) && Files.isDirectory(directory)) {
            try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory)) {
                for (Path file : stream) {
                    if (Files.isRegularFile(file)) {
                        String fileName = file.getFileName().toString();

                        String username = fileName.substring(0, fileName.lastIndexOf("."));

                        HashMap<String,String> cur_data = get_profile(username);
                        String klasse = cur_data.get("klasse");
                        update_metadata(username,klasse,metadata);

                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.err.println("The specified path is not a directory or does not exist.");
        }
        store_meta_data(metadata);
    }
    public void update_profile(String username, Map<String,String> data){
        HashMap<String,String> table = get_profile(username);
        ArrayList<String> sequence = get_sequence(username);
        String top = sequence.get(0);
        if(!data.containsKey(top)){
            if(top.contains("posten1level1")){

            }
            else {
                //somthing went wrong
                System.out.println("hacked?");
                return;
            }
        }
        sequence.remove(0);
        table.putAll(data);
        set_sequence(sequence,username);
        store_profile(username);

    }

    private ArrayList<String> get_sequence(String username) {
        return new ArrayList<>(Arrays.asList(get_profile(username).get("sequence").split(" ")));
    }
    private void set_sequence(ArrayList<String> sequence,String username){
        String code = "";
        for(int i =0;i<sequence.size();i++){
            code += sequence.get(i)+" ";
        }
        data_table.get(username).put("sequence",code.trim());
    }

    public HashMap<String,String> get_profile(String username){
        if(!data_table.containsKey(username)) {
            data_table.put(username,load_profile(username));

        }
        if(!data_table.get(username).containsKey("sequence")){
            add_sequence(username);
        }
        return data_table.get(username);

    }

    public String level_overview(){
        HashMap<String,String[]> level_map1 = new HashMap<>();
        level_map1.put("posten1level1",new String[]{"_a","_b","_c"});
        level_map1.put("posten1level2_1",new String[]{"a","b","c","d"});
        level_map1.put("posten1level2_2",new String[]{"a"});
        level_map1.put("posten1level3",new String[]{"_a","_b","_c"});
        level_map1.put("posten2level1",new String[]{"a","b","c"});
        level_map1.put("posten2level2",new String[]{"a","b"});
        level_map1.put("posten2level3",new String[]{"a","b"});
        level_map1.put("posten2level4",new String[]{"a","b","c","d"});
        level_map1.put("posten3level4a",new String[]{"1","2","3","4","5","6","7"});
        level_map1.put("posten3level4b",new String[]{"1","2","3","4","5","6","7"});
        level_map1.put("posten3level5a",new String[]{"1","2","3","4","5","6","7","8","9","10","11","12","13"});
        level_map1.put("posten3level5b",new String[]{"1","2","3","4","5","6","7","8","9","10","11","12","13"});
        level_map1.put("posten3level6a",new String[]{"1","2","3","4","5","6","7","8","9","10","11","12","13"});
        level_map1.put("posten3level6b",new String[]{"1","2","3","4","5","6","7","8","9","10","11","12","13"});
        level_map1.put("posten3level7a",new String[]{"1","2","3","4","5"});
        level_map1.put("posten3level7b",new String[]{"1","2","3","4","5"});
        Map<String, ArrayList<String>> level_map = level_map1.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> new ArrayList<>(Arrays.asList(entry.getValue()))
                ));
        ArrayList<String> sequence = new ArrayList<>();
        ArrayList<String> temp;
        sequence.addAll(random_draw(level_map.get("posten1level1"),3,"posten1level1"));
        temp = random_draw(level_map.get("posten1level2_1"),4,"posten1level2_1");
        temp.addAll(random_draw(level_map.get("posten1level2_2"),1,"posten1level2_2"));
        sequence.addAll(random_draw(temp,5));
        sequence.addAll(random_draw(level_map.get("posten1level3"),3,"posten1level3"));
        sequence.add("posten1level4");
        sequence.addAll(random_draw(level_map.get("posten2level1"),3,"posten2level1"));
        sequence.addAll(random_draw(level_map.get("posten2level2"),2,"posten2level2"));
        sequence.addAll(random_draw(level_map.get("posten2level3"),2,"posten2level3"));
        sequence.addAll(random_draw(level_map.get("posten2level4"),4,"posten2level4"));
        sequence.add("posten3level3");

        temp = random_draw(level_map.get("posten3level7a"),5,"posten3level7a");
        add_h_b(temp);
        temp.addAll( random_draw(level_map.get("posten3level4a"),4,"posten3level4a"));
        sequence.addAll(random_draw(temp,9));

        temp = random_draw(level_map.get("posten3level7b"),5,"posten3level7b");
        add_h_b(temp);
        temp.addAll( random_draw(level_map.get("posten3level4b"),4,"posten3level4b"));
        sequence.addAll(random_draw(temp,9));


        String temp2 = "posten3level6a"+level_map.get("posten3level6a").remove(6)+"b";
        temp = random_draw(level_map.get("posten3level6a"),9,"posten3level6a");
        add_h_b(temp);
        temp.add(temp2);
        temp.addAll( random_draw(level_map.get("posten3level5a"),5,"posten3level5a"));
        sequence.addAll(random_draw(temp,15));

        temp2 = "posten3level6b"+level_map.get("posten3level6b").remove(4)+"b";
        temp = random_draw(level_map.get("posten3level6b"),9,"posten3level6b");
        add_h_b(temp);
        temp.add(temp2);
        temp.addAll( random_draw(level_map.get("posten3level5b"),5,"posten3level5b"));
        sequence.addAll(random_draw(temp,15));

        StringBuilder ret = new StringBuilder();
        for(int i = 0; i<sequence.size();i++){
            ret.append(sequence.get(i)+" ");
        }



        return ret.toString().trim();

    }

    private void add_sequence(String username) {
        HashMap<String,String[]> level_map1 = new HashMap<>();
        level_map1.put("posten1level1",new String[]{"_a","_b","_c"});
        level_map1.put("posten1level2_1",new String[]{"a","b","c","d"});
        level_map1.put("posten1level2_2",new String[]{"a"});
        level_map1.put("posten1level3",new String[]{"_a","_b","_c"});
        level_map1.put("posten2level1",new String[]{"a","b","c"});
        level_map1.put("posten2level2",new String[]{"a","b"});
        level_map1.put("posten2level3",new String[]{"a","b"});
        level_map1.put("posten2level4",new String[]{"a","b","c","d"});
        level_map1.put("posten3level4a",new String[]{"1","2","3","4","5","6","7"});
        level_map1.put("posten3level4b",new String[]{"1","2","3","4","5","6","7"});
        level_map1.put("posten3level5a",new String[]{"1","2","3","4","5","6","7","8","9","10","11","12","13"});
        level_map1.put("posten3level5b",new String[]{"1","2","3","4","5","6","7","8","9","10","11","12","13"});
        level_map1.put("posten3level6a",new String[]{"1","2","3","4","5","6","7","8","9","10","11","12","13"});
        level_map1.put("posten3level6b",new String[]{"1","2","3","4","5","6","7","8","9","10","11","12","13"});
        level_map1.put("posten3level7a",new String[]{"1","2","3","4","5"});
        level_map1.put("posten3level7b",new String[]{"1","2","3","4","5"});
        Map<String, ArrayList<String>> level_map = level_map1.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> new ArrayList<>(Arrays.asList(entry.getValue()))
                ));
        Random random = new Random();
        ArrayList<String> sequence = new ArrayList<>();
        ArrayList<String> temp;
        sequence.addAll(random_draw(level_map.get("posten1level1"),3,"posten1level1"));
        temp = random_draw(level_map.get("posten1level2_1"),4,"posten1level2_1");
        temp.addAll(random_draw(level_map.get("posten1level2_2"),1,"posten1level2_2"));
        sequence.addAll(random_draw(temp,5));
        sequence.addAll(random_draw(level_map.get("posten1level3"),3,"posten1level3"));
        sequence.add("posten1level4");
        sequence.addAll(random_draw(level_map.get("posten2level1"),3,"posten2level1"));
        sequence.addAll(random_draw(level_map.get("posten2level2"),2,"posten2level2"));
        sequence.addAll(random_draw(level_map.get("posten2level3"),2,"posten2level3"));
        sequence.add("posten2level4"+level_map.get("posten2level4").remove(3));
        sequence.addAll(random_draw(level_map.get("posten2level4"),3,"posten2level4"));
        sequence.add("posten3level3");

        temp = random_draw(level_map.get("posten3level7a"),5,"posten3level7a");
        add_h_b(temp);
        temp.addAll( random_draw(level_map.get("posten3level4a"),4,"posten3level4a"));
        sequence.addAll(random_draw(temp,9));

        temp = random_draw(level_map.get("posten3level7b"),5,"posten3level7b");
        add_h_b(temp);
        temp.addAll( random_draw(level_map.get("posten3level4b"),4,"posten3level4b"));
        sequence.addAll(random_draw(temp,9));


        String temp2 = "posten3level6a"+level_map.get("posten3level6a").remove(6)+"b";
        temp = random_draw(level_map.get("posten3level6a"),9,"posten3level6a");
        add_h_b(temp);
        temp.add(temp2);
        temp.addAll( random_draw(level_map.get("posten3level5a"),5,"posten3level5a"));
        sequence.addAll(random_draw(temp,15));

        temp2 = "posten3level6b"+level_map.get("posten3level6b").remove(4)+"b";
        temp = random_draw(level_map.get("posten3level6b"),9,"posten3level6b");
        add_h_b(temp);
        temp.add(temp2);
        temp.addAll( random_draw(level_map.get("posten3level5b"),5,"posten3level5b"));
        sequence.addAll(random_draw(temp,15));



        set_sequence(sequence,username);
    }
    void add_h_b(List<String> names){

        Random random = new Random();
        if(random.nextDouble()<0.5) {
            for(int i = 0; i<names.size();i++){
                if(i<names.size()/2){
                    names.set(i,names.get(i)+"h");
                }
                else{
                    names.set(i,names.get(i)+"b");
                }
            }


        }
        else{
            for(int i = 0; i<names.size();i++){
                if(i<names.size()/2){
                    names.set(i,names.get(i)+"b");
                }
                else{
                    names.set(i,names.get(i)+"h");
                }
            }

        }

    }
    ArrayList<String> random_draw(ArrayList<String> set,int num_sample,String prefix){

        Random random = new Random();
        ArrayList<String> ret = new ArrayList<>();
        for(int i = 0; i<num_sample;i++) {

            ret.add(prefix+set.remove(random.nextInt(set.size())));
        }
        return ret;
    }
    ArrayList<String> random_draw(ArrayList<String> set,int num_sample){
        return random_draw(set,num_sample,"");
    }

    HashMap<String,String> load_profile(String username){
        String dataDirectory = "data/";  // Change this to your desired directory
        String filePath = dataDirectory + username + ".txt";
        File file = new File(filePath);
        try {
            if(!file.exists()){
                return new HashMap<>();
            }
            String fileContent = new String(Files.readAllBytes(Paths.get(file.getPath())));
            return decode(String_Sequence_Encoder.decode(fileContent));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    //flatten the key values pairs into a list
        synchronized void store_profile(String username){
            String dataDirectory = "data/";  // Change this to your desired directory
            String filePath = dataDirectory + username + ".txt";
            File file = new File(filePath);
            try {
                if (!file.exists()) {
                    file.getParentFile().mkdirs();  // Create the directory structure if it doesn't exist
                    file.createNewFile();  // Create the file
                }

                BufferedWriter writer = new BufferedWriter(new FileWriter(file));
                String seq = String_Sequence_Encoder.encoding(encode(data_table.get(username)));
                writer.write(seq);
                writer.flush();
                writer.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

    public synchronized boolean delete_profile(String username) {
        String dataDirectory = "data/";  // Change this to your desired directory
        String filePath = dataDirectory + username + ".txt";
        File file = new File(filePath);

        if (file.exists()) {
            if (file.delete()) {
                remove_from_metadata(username);
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    private HashMap<String, String> decode(ArrayList<String> parts) {
        HashMap<String,String> ret = new HashMap<>();
        if(parts.size()==0)
            return ret;
        String last = parts.get(0);
        for(int i = 1; i<parts.size();i++){
            if(i%2==0){

            }
            else{
                ret.put(last,parts.get(i));
            }
            last = parts.get(i);
        }
        return ret;
    }
    private ArrayList<String> encode(HashMap<String,String> map) {
        ArrayList<String> ret = new ArrayList<>();
        map.forEach((k,v)->{
            ret.add(k);
            ret.add(v);
        });
        return ret;
    }

    public synchronized HashMap<String,String> meta_data() {
        String directoryPath = "data/meta_data/meta_data.txt";
        File file = new File(directoryPath);
        try {
            if(!file.exists()){
                return new HashMap<>();
            }
            String fileContent = new String(Files.readAllBytes(Paths.get(file.getPath())));
            return decode(String_Sequence_Encoder.decode(fileContent));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    private synchronized  void store_meta_data(HashMap<String,String> meta_data){
        String dataDirectory = "data/meta_data/meta_data.txt";  // Change this to your desired directory
        File file = new File(dataDirectory);
        try {
            if (!file.exists()) {
                file.getParentFile().mkdirs();  // Create the directory structure if it doesn't exist
                file.createNewFile();  // Create the file
            }

            BufferedWriter writer = new BufferedWriter(new FileWriter(file));
            String seq = String_Sequence_Encoder.encoding(encode(meta_data));
            writer.write(seq);
            writer.flush();
            writer.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }
    public void remove_from_metadata(String username){
        HashMap<String,String> meta_data = meta_data();
        AtomicReference<String> target_class = new AtomicReference<>();
        meta_data.forEach((k,v)->{
            if(v.contains(username)){
                target_class.set(k);
            }
        });
        meta_data.put(target_class.get(),meta_data.get(target_class.get()).replace("*&**%&"+username,""));
        store_meta_data(meta_data);
    }
    public void update_metadata(String username, String klasse,HashMap<String,String> meta_data){
        assert !username.contains("*&**%&") && !klasse.contains("*&**%&");


        if(!meta_data.containsKey("klassen")){
            meta_data.put("klassen",klasse);
            meta_data.put(klasse,username);
        }
        else{
            if(meta_data.get("klassen").contains(klasse)){
                meta_data.put(klasse,meta_data.get(klasse)+"*&**%&"+username);
            }
            else{
                meta_data.put("klassen",meta_data.get("klassen")+"*&**%&"+klasse);
                meta_data.put(klasse,username);
            }
        }


    }
    public void update_metadata(String username, String klasse){
        HashMap<String,String> meta_data = meta_data();
        update_metadata(username,klasse,meta_data);
        store_meta_data(meta_data);
    }
}
