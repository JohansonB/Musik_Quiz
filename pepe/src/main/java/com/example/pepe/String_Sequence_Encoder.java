package com.example.pepe;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;
import java.util.regex.Pattern;


public class String_Sequence_Encoder {
    static int separator_length(int string_length, double sample_p, int alphabet_size){
        return (int)Math.ceil((Math.log(string_length)-Math.log(1-sample_p))/Math.log(alphabet_size));

    }
    static String seperator(ArrayList<String> strings, int special_char){
        int n = 0;
        for(String s : strings){
            if(s==null) {
                s = "";
            }
                n += s.length();

        }
        int sep_len = separator_length(n,0.99,254);
        boolean succes = false;
        byte[] chars = new byte[sep_len];
        Random random = new Random();
        String seq = null;

        while (!succes) {
            //generate sample
            for (int i = 0; i<sep_len;i++){
                chars[i] = (byte) random.nextInt(256);
                while (chars[i] == special_char){
                    chars[i] = (byte) random.nextInt(256);
                }
            }

            //test if any of the string contains the sample as substring
            seq = new String(chars,StandardCharsets.ISO_8859_1);
            boolean contains = false;

            for(String s : strings){
                if(s.contains(seq)){
                    contains = true;
                    break;
                }
            }

            //if no the solution has been found and is stored in the seq variable
            if(!contains){
                succes = true;
            }

        }
        return seq;
    }
    public static String encoding(ArrayList<String> strings, int sepcial_char){
        if(strings.size()==0){
            return "";
        }
        String special_string = new String(new byte[]{(byte) sepcial_char}, StandardCharsets.ISO_8859_1);
        String seq = seperator(strings,sepcial_char);
        StringBuilder sb = new StringBuilder();
        sb.append(special_string);
        sb.append(seq);
        sb.append(special_string);
        for(int i = 0 ; i<strings.size();i++){
            sb.append(strings.get(i));
            if(i != strings.size()-1)
                sb.append(seq);
        }
        return sb.toString();

    }
    public static String encoding(ArrayList<String> strings){
        int spec_char = 2;

        return encoding(strings,spec_char);
    }

    public static ArrayList<String> decode(String encoding){
        int special_char = 0;
        int cur_char;
        int index = 0;
        StringBuilder seq = new StringBuilder();
        String cur_string;

        try {
            if(encoding.length()==0){
                return new ArrayList<>();
            }
            special_char = encoding.substring(0, 1).getBytes("ISO_8859_1")[0];
            encoding = encoding.substring(1);
            while (true) {
                cur_string = encoding.substring(0 + index, 1 + index);
                index++;
                cur_char = cur_string.getBytes("ISO_8859_1")[0];
                if (cur_char == special_char) {
                    break;
                }

                seq.append(cur_string);


            }
            encoding = encoding.substring(index);
        }
        catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            System.exit(-1);
        }
        return new ArrayList<>(Arrays.asList(encoding.split(Pattern.quote(seq.toString()))));

    }
}
