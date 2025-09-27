package com.example.pepe;

public class Tuple <A,B>{
    public A ele1;
    public B ele2;
    public Tuple(A ele1, B ele2){
        this.ele1 = ele1;
        this.ele2 = ele2;
    }
    @Override
    public boolean equals(Object o){
        if(o instanceof Tuple && ele1.equals(((Tuple<?, ?>) o).ele1) && ele2.equals(((Tuple<?, ?>) o).ele2)){
                return true;
        }
        else{
            return false;
        }
    }

}
