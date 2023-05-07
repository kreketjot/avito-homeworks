package ru.kreketjot;

import java.util.HashSet;
import java.util.Set;

public class AuthorizedUsers {
  private Set<String> authorizedUsers;

  public AuthorizedUsers() {
    authorizedUsers = Set.of("Andrey");
  }

  public boolean isAuthorized(String user) {
    return authorizedUsers.contains(user);
  }
}
