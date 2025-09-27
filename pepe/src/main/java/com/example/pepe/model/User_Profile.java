package com.example.pepe.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicInteger;

//Wrapper class for the map returned by the User_storage get_profile() method
public class User_Profile {
    enum Module_Id{B,C,D,E,F,G;

        @Override
        public String toString() {
            if(this==B){
                return "module B";
            }
            else if(this==C){
                return "module C";
            }
            else if(this==D){
                return "module D";
            }
            else if(this==E){
                return "module E";
            }
            else if(this==F){
                return "module F";
            }
            else{
                return "module G";
            }
        }
    }
    enum Grade{
        ERREICHT,TEILWEISE_ERREICHT,NICHT_ERREICHT;
        int value(){
            if(this == ERREICHT){
                return 3;
            }
            else if(this==TEILWEISE_ERREICHT)
                return 2;
            else
                return 1;
        }

        @Override
        public String toString() {
            if(this==ERREICHT){
                return "erreicht";
            }
            else if(this==TEILWEISE_ERREICHT){
                return "teilweise erreicht";
            }
            else{
                return "nicht erreicht";
            }
        }
    }

    //exercise-id -> raw-exercise-input
    HashMap<String,String> profile_map;
    public User_Profile(HashMap<String,String> in){
        profile_map = in;

    }
    public class Results_Tree{
        public HashMap<String, String> get_results(){
            HashMap<String,String> ret = new HashMap<>();
            for(Module m: modules){
                for(Module.Exercise e : m.exercises){
                    ret.put(e.exercise_id,e.points+"***"+e.grade.toString());
                }
            }
            return ret;
        }
        public HashMap<String,String> get_analysis(){
            HashMap<String,String> ret = new HashMap<>();
            for(Module m: modules){
                ret.put(m.id.toString(),m.module_grade.toString());
            }
            return ret;

        }
        ArrayList<Module> modules;
        public Results_Tree(){
            modules = new ArrayList<>();
            Arrays.stream(Module_Id.values()).forEach(v -> modules.add(new Module(v)));
        }
        class Module{

            Grade module_grade;
            Module_Id id;
            ArrayList<Exercise> exercises;

            Module(Module_Id id){
                this.id = id;
                if(id == Module_Id.B){
                    exercises = new ArrayList<>(Arrays.asList(new Exercise("posten1level1"),new Exercise("posten2level1")));
                }
                else if(id == Module_Id.C){
                    exercises = new ArrayList<>(Arrays.asList(new Exercise("posten2level2"),new Exercise("posten3level3")));
                }
                else if(id == Module_Id.D){
                    exercises = new ArrayList<>(Arrays.asList(new Exercise("posten1level2"),new Exercise("posten1level4")));
                }
                else if(id == Module_Id.E){
                    exercises = new ArrayList<>(Arrays.asList(new Exercise("posten3level4"),new Exercise("posten3level5"),new Exercise("posten3level6"),new Exercise("posten3level7")));
                }
                else if(id == Module_Id.F){
                    exercises = new ArrayList<>(Arrays.asList(new Exercise("posten1level3")));
                }
                else{
                    exercises = new ArrayList<>(Arrays.asList(new Exercise("posten2level3"),new Exercise("posten2level4")));
                }
                grade();
            }
            private  void grade(){
                if(id == Module_Id.B||id== Module_Id.C||id== Module_Id.D||id== Module_Id.G){
                    /*if(exercises.get(0).grade==Grade.ERREICHT&&exercises.get(1).grade==Grade.ERREICHT)
                        module_grade = Grade.ERREICHT;
                    else if(exercises.get(0).grade==Grade.ERREICHT&&exercises.get(1).grade==Grade.TEILWEISE_ERREICHT)
                        module_grade = Grade.ERREICHT;
                    else if(exercises.get(1).grade==Grade.ERREICHT&&exercises.get(0).grade==Grade.TEILWEISE_ERREICHT)
                        module_grade = Grade.ERREICHT;
                    else if(exercises.get(0).grade==Grade.TEILWEISE_ERREICHT&&exercises.get(1).grade==Grade.TEILWEISE_ERREICHT)
                        module_grade = Grade.TEILWEISE_ERREICHT;
                    else if(exercises.get(0).grade==Grade.ERREICHT&&exercises.get(1).grade==Grade.NICHT_ERREICHT)
                        module_grade = Grade.TEILWEISE_ERREICHT;
                    else if(exercises.get(1).grade==Grade.ERREICHT&&exercises.get(0).grade==Grade.NICHT_ERREICHT)
                        module_grade = Grade.TEILWEISE_ERREICHT;
                    else
                        module_grade = Grade.NICHT_ERREICHT;*/
                    if(exercises.get(0).grade.value()+exercises.get(1).grade.value()>=5)
                        module_grade= Grade.ERREICHT;
                    else if(exercises.get(0).grade.value()+exercises.get(1).grade.value()>=4)
                        module_grade= Grade.TEILWEISE_ERREICHT;
                    else
                        module_grade = Grade.NICHT_ERREICHT;
                }
                else if(id== Module_Id.F){
                    module_grade = exercises.get(0).grade;
                }
                else {
                    if(exercises.get(0).grade.value()+exercises.get(1).grade.value()+exercises.get(2).grade.value()+exercises.get(3).grade.value()>=10)
                        module_grade= Grade.ERREICHT;
                    else if(exercises.get(0).grade.value()+exercises.get(1).grade.value()+exercises.get(2).grade.value()+exercises.get(3).grade.value()>=8)
                        module_grade= Grade.TEILWEISE_ERREICHT;
                    else
                        module_grade = Grade.NICHT_ERREICHT;

                }
            }

            class Exercise{
                ArrayList<Exercise_Instance> exercise_instances;
                String exercise_id;
                double points = 0;

                Grade grade;
                public Exercise(String exercise_id){
                    this.exercise_id = exercise_id;
                    exercise_instances = new ArrayList<>();
                    profile_map.forEach((k,v)->{
                        if(k.contains(exercise_id))
                            exercise_instances.add(new Exercise_Instance(exercise_id,k));
                    });
                    exercise_instances.forEach(k->points+=k.points);
                    grade();
                }
                void grade(){
                    if(exercise_id.equalsIgnoreCase("posten1level1")){
                        assert points<=3;
                        if(points==3){
                            grade = Grade.ERREICHT;
                        }
                        else if(points==2){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten1level2")){
                        int tot = 7;
                        assert points<=7;
                        AtomicInteger cur_2_1 = new AtomicInteger(0);
                        AtomicInteger cur_2_2 = new AtomicInteger(0);
                        profile_map.forEach((k,v)->{
                            if(k.contains("posten1level2_1"))
                                cur_2_1.getAndIncrement();
                            else if(k.contains("posten1level2_2"))
                                cur_2_2.getAndIncrement();
                        });
                        tot = cur_2_1.get()+3*cur_2_2.get();
                        if(points>=tot-1){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=tot-2){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade=Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten1level3")){
                        assert points<=34;
                        if(points>=31){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=17){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten1level4")){
                        assert points<=24;
                        if(points>=23.5){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=22){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten2level1")){
                        assert points<=3;
                        if(points>=3){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=2){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten2level2")){
                        assert points<=32;
                        if(points>=30){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=26){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten2level3")){
                        assert points<=64;
                        if(points>=62){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=59){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten2level4")){
                        assert points<=4;
                        if(points>=4){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=3.5){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten3level3")){
                        assert points<=6;
                        if(points>=6){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=5){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten3level4")){
                        assert points<=8;
                        if(points>=8){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=7){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten3level7")){
                        assert points<=10;
                        if(points>=9){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=7){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten3level5")){
                        assert points<=10;
                        if(points>=9){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=7){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }
                    else if(exercise_id.equalsIgnoreCase("posten3level6")){
                        assert points<=20;
                        if(points>=18){
                            grade = Grade.ERREICHT;
                        }
                        else if(points>=16){
                            grade = Grade.TEILWEISE_ERREICHT;
                        }
                        else {
                            grade= Grade.NICHT_ERREICHT;
                        }
                    }

                }
                class Exercise_Instance{
                    String parent_id;
                    String concrete_exercise_id;
                    double points = 0;
                    Exercise_Instance(String parent_id, String concrete_exercise_id) {
                        this.parent_id = parent_id;
                        this.concrete_exercise_id = concrete_exercise_id;
                        compute_score();
                    }
                    void compute_score(){
                        assert profile_map.containsKey(concrete_exercise_id);
                        //posten1Level1 hören;
                        if(concrete_exercise_id.equals("posten1level1hoeren_a")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"a");

                        }
                        else if(concrete_exercise_id.equals("posten1level1hoeren_b")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"b");

                        }
                        else if(concrete_exercise_id.equals("posten1level1hoeren_c")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"c");
                        }
                        //posten1level1sehen
                        else if(concrete_exercise_id.equals("posten1level1sehen_a")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"3");

                        }
                        else if(concrete_exercise_id.equals("posten1level1sehen_b")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"10");

                        }
                        else if(concrete_exercise_id.equals("posten1level1sehen_c")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"8");
                        }
                        //posten1level2
                        else if(concrete_exercise_id.equals("posten1level2_1a")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"2");

                        }
                        else if(concrete_exercise_id.equals("posten1level2_1b")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"3");

                        }
                        else if(concrete_exercise_id.equals("posten1level2_1c")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"1");
                        }
                        else if(concrete_exercise_id.equals("posten1level2_1d")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"2");

                        }
                        else if(concrete_exercise_id.equals("posten1level2_2a")){
                            if(profile_map.get(concrete_exercise_id).equals("")){
                                points = 0;
                                return;
                            }
                            String[] split = profile_map.get(concrete_exercise_id).trim().split("\s+");
                            assert split.length == 3;
                            points += evaluate_multiple_choice(split[0].trim(),"1");
                            points += evaluate_multiple_choice(split[1].trim(),"2");
                            points += evaluate_multiple_choice(split[2].trim(),"4");

                        }
                        else if(concrete_exercise_id.equals("posten1level2_2b")){
                            if(profile_map.get(concrete_exercise_id).equals("")){
                                points = 0;
                                return;
                            }
                            String[] split = profile_map.get(concrete_exercise_id).trim().split("\s+");
                            assert split.length == 3;
                            points += evaluate_multiple_choice(split[0].trim(),"4");
                            points += evaluate_multiple_choice(split[1].trim(),"1");
                            points += evaluate_multiple_choice(split[2].trim(),"2");

                        }
                        else if(concrete_exercise_id.equals("posten1level3_a")){
                            String solution = "CDECGAGFEC";
                            if(profile_map.get(concrete_exercise_id).trim().equals("")){
                                points = 0;
                                return;
                            }
                            String[] split = profile_map.get(concrete_exercise_id).trim().split("\s+");
                            String[] solution_array = parse_result_p1l3(solution).toArray(new String[0]);
                            double cur_max = 0;
                            double max_length = 0;
                            double cur;
                            for(String s : split) {
                                String[] s_array = parse_result_p1l3(s).toArray(new String[0]);
                                cur = compare_elementwise(solution_array,s_array);
                                if(cur>cur_max){
                                    cur_max=cur;
                                    max_length = s_array.length;
                                }

                            }
                            points += cur_max;
                            points -= Math.abs(max_length-solution_array.length);
                            if(points<0)
                                points = 0;
                        }
                        else if(concrete_exercise_id.equals("posten1level3_b")){
                            String solution = "FCFAFGFEDC";
                            if(profile_map.get(concrete_exercise_id).trim().equals("")){
                                points = 0;
                                return;
                            }
                            String[] split = profile_map.get(concrete_exercise_id).trim().split("\s+");
                            String[] solution_array = parse_result_p1l3(solution).toArray(new String[0]);
                            double cur_max = 0;
                            double max_length = 0;
                            double cur;
                            for(String s : split) {
                                String[] s_array = parse_result_p1l3(s).toArray(new String[0]);
                                cur = compare_elementwise(solution_array,s_array);
                                if(cur>cur_max){
                                    cur_max=cur;
                                    max_length = s_array.length;
                                }

                            }
                            points += cur_max;
                            points -= Math.abs(max_length-solution_array.length);
                            if(points<0)
                                points = 0;
                        }
                        else if(concrete_exercise_id.equals("posten1level3_c")){
                            if(profile_map.get(concrete_exercise_id).trim().equals("")){
                                points = 0;
                                return;
                            }
                            String[] split = profile_map.get(concrete_exercise_id).trim().split("\s+");
                            String solution = "CCGGAAGFFEEDDC";
                            String[] solution_array = parse_result_p1l3(solution).toArray(new String[0]);
                            double cur_max = 0;
                            double max_length = 0;
                            double cur;
                            for(String s : split) {
                                String[] s_array = parse_result_p1l3(s).toArray(new String[0]);
                                cur = compare_elementwise(solution_array,s_array);
                                if(cur>cur_max){
                                    cur_max=cur;
                                    max_length = s_array.length;
                                }

                            }
                            points += cur_max;
                            points -= Math.abs(max_length-solution_array.length);
                            if(points<0)
                                points = 0;
                        }
                        else if(concrete_exercise_id.equals("posten1level4")){
                            if (profile_map.get(concrete_exercise_id).equals("")){
                                points = 0;
                                return;
                            }
                            //todo: hardest one of the whole bunch
                            String[] temp = profile_map.get(concrete_exercise_id).trim().split("\s+");
                            assert temp.length<=2;
                            ArrayList<String> played_notes = parse_result_p1l3(temp[0]);
                            if(temp.length<2){
                                points = played_notes.size();
                                return;
                            }
                            ArrayList<Integer> placed_notes = parse_indices_p1l4(temp[1]);
                            HashMap<String,int[]> note_index_mapping = new HashMap<>();
                            note_index_mapping.put("C",new int[]{11});
                            note_index_mapping.put("D",new int[]{10});
                            note_index_mapping.put("E",new int[]{9});
                            note_index_mapping.put("F",new int[]{8});
                            note_index_mapping.put("G",new int[]{7});
                            note_index_mapping.put("A",new int[]{6});
                            note_index_mapping.put("B",new int[]{5});
                            note_index_mapping.put("C#",new int[]{11,10});
                            note_index_mapping.put("D#",new int[]{10,9});
                            note_index_mapping.put("F#",new int[]{8,7});
                            note_index_mapping.put("G#",new int[]{7,6});
                            note_index_mapping.put("A#",new int[]{6,5});
                            points = evaluate_p1l4(note_index_mapping,played_notes,placed_notes);
                        }
                        else if(concrete_exercise_id.equals("posten2level1a")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"a");

                        }
                        else if(concrete_exercise_id.equals("posten2level1b")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"a");

                        }
                        else if(concrete_exercise_id.equals("posten2level1c")){
                            points = evaluate_multiple_choice(profile_map.get(concrete_exercise_id).trim(),"c");

                        }
                        //posten2level2
                        else if(concrete_exercise_id.equals("posten2level2a")){
                            String solution = "1 -1 1 -1 1 1 -1 1 1 -1 -1 -1 -1 -1 1 -1";
                            if(profile_map.get(concrete_exercise_id).trim().equals("")){
                                points = 0;
                            }
                            else{
                                String[] split = profile_map.get(concrete_exercise_id).trim().split("\s+");
                                assert split.length == 16;
                                points = compare_elementwise(split,solution.trim().split("\s+"));
                                /*points+= evaluate_multiple_choice(split[0],"1");
                                points+= evaluate_multiple_choice(split[1],"-1");
                                points+= evaluate_multiple_choice(split[2],"1");
                                points+= evaluate_multiple_choice(split[3],"-1");
                                points+= evaluate_multiple_choice(split[4],"1");
                                points+= evaluate_multiple_choice(split[5],"1");
                                points+= evaluate_multiple_choice(split[6],"-1");
                                points+= evaluate_multiple_choice(split[7],"1");
                                points+= evaluate_multiple_choice(split[8],"1");
                                points+= evaluate_multiple_choice(split[9],"-1");
                                points+= evaluate_multiple_choice(split[10],"-1");
                                points+= evaluate_multiple_choice(split[11],"-1");
                                points+= evaluate_multiple_choice(split[12],"-1");
                                points+= evaluate_multiple_choice(split[13],"-1");
                                points+= evaluate_multiple_choice(split[14],"1");
                                points+= evaluate_multiple_choice(split[15],"-1");*/
                            }

                        }
                        else if(concrete_exercise_id.equals("posten2level2b")){
                            if(profile_map.get(concrete_exercise_id).trim().equals("")){
                                points = 0;
                            }
                            else{
                                String[] split = profile_map.get(concrete_exercise_id).trim().split("\s+");
                                assert split.length == 16;
                                String solution = "1 1 -1 -1 1 1 1 -1 1 -1 1 -1 1 1 1 1";
                                points = compare_elementwise(split,solution.split("\s+"));
                                /*points+= evaluate_multiple_choice(split[0],"1");
                                points+= evaluate_multiple_choice(split[1],"1");
                                points+= evaluate_multiple_choice(split[2],"-1");
                                points+= evaluate_multiple_choice(split[3],"-1");
                                points+= evaluate_multiple_choice(split[4],"1");
                                points+= evaluate_multiple_choice(split[5],"1");
                                points+= evaluate_multiple_choice(split[6],"1");
                                points+= evaluate_multiple_choice(split[7],"-1");
                                points+= evaluate_multiple_choice(split[8],"1");
                                points+= evaluate_multiple_choice(split[9],"-1");
                                points+= evaluate_multiple_choice(split[10],"1");
                                points+= evaluate_multiple_choice(split[11],"-1");
                                points+= evaluate_multiple_choice(split[12],"1");
                                points+= evaluate_multiple_choice(split[13],"1");
                                points+= evaluate_multiple_choice(split[14],"1");
                                points+= evaluate_multiple_choice(split[15],"1");*/
                            }

                        }
                        else if(concrete_exercise_id.equals("posten2level3a")){
                            if(profile_map.get(concrete_exercise_id).trim().equals("")){
                                points = 0;
                            }
                            else{
                                String[] split = profile_map.get(concrete_exercise_id).trim().split("\s+");
                                String solution = "1 -1 -1 -1 -1 -1 -1 -1 1 -1 -1 1 1 -1 -1 -1 1 -1 1 1 1 -1 1 -1 1 -1 -1 -1 -1 -1 1 -1";
                                assert split.length == 32;
                                points = compare_elementwise(solution.trim().split("\s+"),split);
                            }

                        }
                        else if(concrete_exercise_id.equals("posten2level3b")){
                            if(profile_map.get(concrete_exercise_id).trim().equals("")){
                                points = 0;
                            }
                            else{
                                String[] split = profile_map.get(concrete_exercise_id).trim().split("\s+");
                                String solution = "1 -1 -1 -1 1 -1 -1 -1 -1 -1 -1 -1 1 -1 1 -1 1 -1 -1 -1 1 -1 1 -1 -1 -1 1 1 1 -1 -1 -1";
                                assert split.length == 32;
                                points = compare_elementwise(split,solution.trim().split("\s+"));

                            }

                        }
                        else if (concrete_exercise_id.equals("posten2level4a")){
                            points = score_p2l4(new String[]{"SechzehntelNote","SechzehntelNote","SechzehntelNote","SechzehntelNote","SechzehntelNote", "AchtelNotePunkt", "AchtelNotePunkt"},profile_map.get(concrete_exercise_id));
                        }
                        else if (concrete_exercise_id.equals("posten2level4b")){
                            points = score_p2l4(new String[]{"SechzehntelNote","SechzehntelPause","AchtelNote","AchtelNotePunkt"},profile_map.get(concrete_exercise_id));
                        }
                        else if (concrete_exercise_id.equals("posten2level4c")){
                            points = score_p2l4(new String[]{"HalbePause","AchtelNotePunkt"},profile_map.get(concrete_exercise_id));
                        }
                        else if (concrete_exercise_id.equals("posten2level4d")){
                            points = score_p2l4(new String[]{"SechzehntelNote","SechzehntelNote","AchtelPause","AchtelPause","AchtelPause"},profile_map.get(concrete_exercise_id));
                        }
                        else if(concrete_exercise_id.equals("posten3level3")){
                            if(profile_map.get(concrete_exercise_id).equals("")){
                                points = 0;
                            }
                            else{
                                String temp = profile_map.get(concrete_exercise_id).trim();
                                assert temp.length() == 6;
                                points += evaluate_multiple_choice("1",String.valueOf(temp.charAt(0)));
                                points += evaluate_multiple_choice("6",String.valueOf(temp.charAt(1)));
                                points += evaluate_multiple_choice("4",String.valueOf(temp.charAt(2)));
                                points += evaluate_multiple_choice("2",String.valueOf(temp.charAt(3)));
                                points += evaluate_multiple_choice("3",String.valueOf(temp.charAt(4)));
                                points += evaluate_multiple_choice("8",String.valueOf(temp.charAt(5)));
                            }

                        }
                        else if(concrete_exercise_id.equals("posten3level4a1")){
                            points+=evaluate_multiple_choice("12normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("5normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4a2")){
                            points+=evaluate_multiple_choice("11normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("4normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4a3")){
                            points+=evaluate_multiple_choice("10normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("3normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4a4")){
                            points+=evaluate_multiple_choice("9normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("2normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4a5")){
                            points+=evaluate_multiple_choice("8normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("1normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4a6")){
                            points+=evaluate_multiple_choice("7normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("0normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4a7")){
                            points+=evaluate_multiple_choice("6normal",profile_map.get(concrete_exercise_id).trim());

                        }

                        else if(concrete_exercise_id.equals("posten3level4b1")){
                            points+=evaluate_multiple_choice("0normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("7normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4b2")){
                            points+=evaluate_multiple_choice("6normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4b3")){
                            points+=evaluate_multiple_choice("12normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("5normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4b4")){
                            points+=evaluate_multiple_choice("11normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("4normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4b5")){
                            points+=evaluate_multiple_choice("10normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("3normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4b6")){
                            points+=evaluate_multiple_choice("9normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("2normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level4b7")){
                            points+=evaluate_multiple_choice("8normal",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("1normal",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a1b")){
                            points+=evaluate_multiple_choice("11b",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("4b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a2b")){
                            points+=evaluate_multiple_choice("10b",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("3b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a3b")){
                            points+=evaluate_multiple_choice("8b",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("1b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a4b")){
                            points+=evaluate_multiple_choice("7b",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("0b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a5b")){
                            points+=evaluate_multiple_choice("6b",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level7b1b")){
                            points+=evaluate_multiple_choice("6b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7b2b")){
                            points+=evaluate_multiple_choice("12b",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("5b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7b3b")){
                            points+=evaluate_multiple_choice("10b",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("3b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7b4b")){
                            points+=evaluate_multiple_choice("9b",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("2b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7b5b")){
                            points+=evaluate_multiple_choice("8b",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("1b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a1h")){
                            points+=evaluate_multiple_choice("12hashtag",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("5hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a2h")){
                            points+=evaluate_multiple_choice("11hashtag",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("4hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a3h")){
                            points+=evaluate_multiple_choice("9hashtag",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("2hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a4h")){
                            points+=evaluate_multiple_choice("8hashtag",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("1hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7a5h")){
                            points+=evaluate_multiple_choice("7hashtag",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("0hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7b1h")){
                            points+=evaluate_multiple_choice("7hashtag",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("0hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7b2h")){
                            points+=evaluate_multiple_choice("6hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7b3h")){
                            points+=evaluate_multiple_choice("11hashtag",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("4hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7b4h")){
                            points+=evaluate_multiple_choice("10hashtag",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("3hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level7b5h")){
                            points+=evaluate_multiple_choice("9hashtag",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("2hashtag",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level5a1")){
                            points+=evaluate_multiple_choice("c",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a2")){
                            points+=evaluate_multiple_choice("d",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a3")){
                            points+=evaluate_multiple_choice("e",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a4")){
                            points+=evaluate_multiple_choice("f",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a5")){
                            points+=evaluate_multiple_choice("g",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a6")){
                            points+=evaluate_multiple_choice("a",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a7")){
                            points+=evaluate_multiple_choice("h",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a8")){
                            points+=evaluate_multiple_choice("c",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a9")){
                            points+=evaluate_multiple_choice("d",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a10")){
                            points+=evaluate_multiple_choice("e",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a11")){
                            points+=evaluate_multiple_choice("f",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a12")){
                            points+=evaluate_multiple_choice("g",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5a13")){
                            points+=evaluate_multiple_choice("a",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b1")){
                            points+=evaluate_multiple_choice("e",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b2")){
                            points+=evaluate_multiple_choice("f",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b3")){
                            points+=evaluate_multiple_choice("g",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b4")){
                            points+=evaluate_multiple_choice("a",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b5")){
                            points+=evaluate_multiple_choice("h",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b6")){
                            points+=evaluate_multiple_choice("c",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b7")){
                            points+=evaluate_multiple_choice("d",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b8")){
                            points+=evaluate_multiple_choice("e",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b9")){
                            points+=evaluate_multiple_choice("f",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b10")){
                            points+=evaluate_multiple_choice("g",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b11")){
                            points+=evaluate_multiple_choice("a",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b12")){
                            points+=evaluate_multiple_choice("h",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level5b13")){
                            points+=evaluate_multiple_choice("c",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level6a1b")){
                            points+=evaluate_multiple_choice("h",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("ces",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a2b")){
                            points+=evaluate_multiple_choice("des",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a3b")){
                            points+=evaluate_multiple_choice("es",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a4b")){
                            points+=evaluate_multiple_choice("e",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("fes",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a5b")){
                            points+=evaluate_multiple_choice("ges",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a6b")){
                            points+=evaluate_multiple_choice("as",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a7b")){
                            points+=evaluate_multiple_choice("b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a8b")){
                            points+=evaluate_multiple_choice("h",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("ces",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a9b")){
                            points+=evaluate_multiple_choice("des",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a10b")){
                            points+=evaluate_multiple_choice("es",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a11b")){
                            points+=evaluate_multiple_choice("e",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("fes",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a12b")){
                            points+=evaluate_multiple_choice("ges",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a13b")){
                            points+=evaluate_multiple_choice("as",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a1h")){
                            points+=evaluate_multiple_choice("cis",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level6a2h")){
                            points+=evaluate_multiple_choice("dis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a3h")){
                            points+=evaluate_multiple_choice("f",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("eis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a4h")){
                            points+=evaluate_multiple_choice("fis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a5h")){
                            points+=evaluate_multiple_choice("gis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a6h")){
                            points+=evaluate_multiple_choice("ais",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a7h")){
                            points+=evaluate_multiple_choice("his",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("c",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a8h")){
                            points+=evaluate_multiple_choice("cis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a9h")){
                            points+=evaluate_multiple_choice("dis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a10h")){
                            points+=evaluate_multiple_choice("f",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("eis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6a11h")){
                            points+=evaluate_multiple_choice("fis",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level6a12h")){
                            points+=evaluate_multiple_choice("gis",profile_map.get(concrete_exercise_id).trim());
                        }
                        else if(concrete_exercise_id.equals("posten3level6a13h")){
                            points+=evaluate_multiple_choice("ais",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b1b")){
                            points+=evaluate_multiple_choice("es",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b2b")){
                            points+=evaluate_multiple_choice("e",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("fes",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b3b")){
                            points+=evaluate_multiple_choice("ges",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b4b")){
                            points+=evaluate_multiple_choice("as",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b5b")){
                            points+=evaluate_multiple_choice("b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b6b")){
                            points+=evaluate_multiple_choice("h",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("ces",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b7b")){
                            points+=evaluate_multiple_choice("des",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b8b")){
                            points+=evaluate_multiple_choice("es",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b9b")){
                            points+=evaluate_multiple_choice("e",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("fes",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b10b")){
                            points+=evaluate_multiple_choice("ges",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b11b")){
                            points+=evaluate_multiple_choice("as",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b12b")){
                            points+=evaluate_multiple_choice("b",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b13b")){
                            points+=evaluate_multiple_choice("h",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("ces",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b1h")){
                            points+=evaluate_multiple_choice("f",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("eis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b2h")){
                            points+=evaluate_multiple_choice("fis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b3h")){
                            points+=evaluate_multiple_choice("gis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b4h")){
                            points+=evaluate_multiple_choice("ais",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b5h")){
                            points+=evaluate_multiple_choice("c",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("his",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b6h")){
                            points+=evaluate_multiple_choice("cis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b7h")){
                            points+=evaluate_multiple_choice("dis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b8h")){
                            points+=evaluate_multiple_choice("f",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("eis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b9h")){
                            points+=evaluate_multiple_choice("fis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b10h")){
                            points+=evaluate_multiple_choice("gis",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b11h")){
                            points+=evaluate_multiple_choice("ais",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b12h")){
                            points+=evaluate_multiple_choice("c",profile_map.get(concrete_exercise_id).trim());
                            points+=evaluate_multiple_choice("his",profile_map.get(concrete_exercise_id).trim());

                        }
                        else if(concrete_exercise_id.equals("posten3level6b13h")){
                            points+=evaluate_multiple_choice("cis",profile_map.get(concrete_exercise_id).trim());

                        }
                    }
                    double evaluate_p1l4(HashMap<String,int[]> map,ArrayList<String> notes,ArrayList<Integer> indices){
                        double points = 0;
                        assert notes.size()==8&&notes.size() == indices.size();
                        boolean greedy_step = false;
                        int new_offset = 0;
                        int offset = 0;
                        for(int i = 0; i<notes.size();i++){
                            int min_dif = Integer.MAX_VALUE;
                            int alt_offset_min_dif = Integer.MAX_VALUE;
                            for(int e : map.get(notes.get(i))){
                                int cur_dif = e-(indices.get(i)+offset);
                                if(Math.abs(cur_dif)<Math.abs(min_dif)){
                                    min_dif = cur_dif;
                                }
                                if(greedy_step){
                                    int alt_cur_dif = e-(indices.get(i)+new_offset);
                                    if(Math.abs(alt_cur_dif)<Math.abs(alt_offset_min_dif)){
                                        alt_offset_min_dif = alt_cur_dif;
                                    }

                                }
                            }
                            if (greedy_step){
                                greedy_step = false;
                            }
                            if(Math.abs(min_dif)>Math.abs(alt_offset_min_dif)){
                                min_dif = alt_offset_min_dif;
                                offset = new_offset;
                            }
                            if (Math.abs(min_dif)==0){
                                points+=2;
                            }
                            else if(Math.abs(min_dif)<=2){
                                points+=2-0.5*Math.abs(min_dif);
                                new_offset = offset + min_dif;
                                greedy_step=true;
                            }
                            else {
                                new_offset = offset + min_dif;
                                greedy_step=true;
                            }

                        }
                        return points+8;
                    }
                    double compare_elementwise(String[] a, String[] b){
                        double ret = 0;
                        int M = Math.min(a.length,b.length);
                        for(int i =0;i< M;i++){
                            ret+= evaluate_multiple_choice(a[i].trim(),b[i].trim());
                        }
                        return ret;
                    }
                    double score_p2l4(String[] constaints, String input){
                        HashMap<String,Double> takt_length_map = new HashMap<>();
                        takt_length_map.put("GanzeNote",1.);
                        takt_length_map.put("GanzePause",1.);
                        takt_length_map.put("GanzeNotePunkt",1.5);
                        takt_length_map.put("GanzePausePunkt",1.5);
                        takt_length_map.put("HalbeNote",0.5);
                        takt_length_map.put("HalbePause",0.5);
                        takt_length_map.put("HalbeNotePunkt",0.75);
                        takt_length_map.put("HalbePausePunkt",0.75);
                        takt_length_map.put("ViertelNote",0.25);
                        takt_length_map.put("ViertelPause",0.25);
                        takt_length_map.put("ViertelNotePunkt",0.375);
                        takt_length_map.put("ViertelPausePunkt",0.375);
                        takt_length_map.put("AchtelNote",0.125);
                        takt_length_map.put("AchtelPause",0.125);
                        takt_length_map.put("AchtelNotePunkt",3/16.);
                        takt_length_map.put("AchtelPausePunkt",3/16.);
                        takt_length_map.put("SechzehntelNote",1/16.);
                        takt_length_map.put("SechzehntelPause",1/16.);
                        takt_length_map.put("SechzehntelNotePunkt",3/32.);
                        takt_length_map.put("SechzehntelPausePunkt",3/32.);
                        ArrayList<String> straints = new ArrayList<>(Arrays.asList(constaints));
                        if(input.equals("")){
                            return 0;
                        }
                        String[] split = input.trim().split("\s+");
                        double tot_takt = 0;
                        for(int i = 0; i<split.length;i++){
                            if(straints.contains(split[i])){
                                straints.remove(split[i]);
                            }
                            tot_takt+=takt_length_map.get(split[i]);

                        }
                        if(!straints.isEmpty()){
                            return 0;
                        }
                        double temp = Math.abs(tot_takt-1);
                        if(temp>1){
                            return 0;
                        }
                        return 1-temp;

                    }
                    ArrayList<Integer> parse_indices_p1l4(String code){
                        ArrayList<Integer> ret = new ArrayList<>();
                        String[] split = code.trim().split(",");
                        for(String s : split){
                            ret.add(Integer.parseInt(s));
                        }
                        return ret;
                    }
                    ArrayList<String> parse_result_p1l3(String result){
                        ArrayList<String> ret = new ArrayList<>();
                        for (int i = 0; i < result.length(); i++) {
                            if(String.valueOf(result.charAt(i)).equals("#")){
                                ret.add(ret.size()-1,ret.get(ret.size()-1)+"#");
                            }
                            else {
                                ret.add(String.valueOf(result.charAt(i)));
                            }
                        }
                        return ret;
                    }
                    double evaluate_multiple_choice(String input,String solution){
                        if(input.equalsIgnoreCase(solution))
                            return  1;
                        else
                            return  0;
                    }

                }

            }


        }
    }
    public static void main(String args[]){
        //User_Profile arafat = new User_Profile(User_Storage.getInstance().get_profile("StefanoTest1"));
        //Results_Tree r_s = arafat.new Results_Tree();
        User_Storage.getInstance().synchronize_meta_data();

    }

}
