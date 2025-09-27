package com.example.pepe;

import com.example.pepe.model.User_Storage;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PepeApplication {

	public static void main(String[] args) {
		try {
			User_Storage.getInstance().synchronize_meta_data();
			SpringApplication.run(PepeApplication.class, args);
		}catch(RuntimeException ex) {
			throw new RuntimeException(ex);
		}
	}

}
