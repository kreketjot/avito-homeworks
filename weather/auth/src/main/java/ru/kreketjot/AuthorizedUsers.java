package ru.kreketjot;

import java.util.Set;

public class AuthorizedUsers implements IAuthorizedUsers {
  private Set<String> authorizedUsers;

  public AuthorizedUsers() {
    authorizedUsers = Set.of("Andrey");
  }

  public boolean isAuthorized(String user) {
    System.out.println(String.format("Check user authorization \"%s\"", user));
    return authorizedUsers.contains(user);
  }
}
