package ru.kreketjot;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import io.grpc.Server;
import io.grpc.ServerBuilder;

public class GrpcServer {
  public static void main(String[] args) {

    int port;

    FileInputStream fis;
    Properties property = new Properties();

    try {
      fis = new FileInputStream("src/main/resources/config.properties");
      property.load(fis);

      port = Integer.parseInt(property.getProperty("server.port"));
    } catch (IOException e) {
      System.err.println("No properties");
      return;
    } catch (NumberFormatException e) {
      System.err.println("Can't parse port property");
      return;
    }

    Server server = ServerBuilder
        .forPort(port)
        .addService(new AuthServiceImpl(new AuthorizedUsers())).build();

    try {
      server.start();
    } catch (IOException e) {
      System.err.println("Failed to start");
      e.printStackTrace();
    }
    try {
      server.awaitTermination();
    } catch (InterruptedException e) {
      System.err.println("Failed to terminate");
      e.printStackTrace();
    }
  }
}
