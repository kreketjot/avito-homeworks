package ru.kreketjot;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import io.grpc.Server;
import io.grpc.ServerBuilder;

public class GrpcServer {
  public static void main(String[] args) {
    Server server = ServerBuilder
        .forPort(getPort())
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

  private static Integer getPortFromEnv() {
    String envPort = System.getenv("PORT");
    if (envPort == null) {
      return null;
    }
    return Integer.valueOf(envPort);
  }

  private static Integer getPortFromProperties() {
    FileInputStream fis;
    Properties property = new Properties();

    try {
      fis = new FileInputStream("src/main/resources/config.properties");
      property.load(fis);

      return Integer.valueOf(property.getProperty("port"));
    } catch (IOException e) {
      System.err.println("No properties");
    } catch (NumberFormatException e) {
      System.err.println("Can't parse port property");
    }
    return null;
  }

  private static int getPort() {
    Integer port = getPortFromEnv();
    if (port != null) {
      return port;
    }
    port = getPortFromProperties();
    if (port != null) {
      return port;
    }
    return 3002;
  }
}
