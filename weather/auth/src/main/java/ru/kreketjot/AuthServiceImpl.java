package ru.kreketjot;

import io.grpc.stub.StreamObserver;
import lombok.AllArgsConstructor;
import ru.kreketjot.auth.AuthServiceGrpc.AuthServiceImplBase;
import ru.kreketjot.auth.CheckAuthorizationRequest;
import ru.kreketjot.auth.CheckAuthorizationResponse;

@AllArgsConstructor
public class AuthServiceImpl extends AuthServiceImplBase {
  private IAuthorizedUsers authorizedUsers;

  @Override
  public void checkAuthorization(
      CheckAuthorizationRequest request,
      StreamObserver<CheckAuthorizationResponse> responseStreamObserver) {
    String user = request.getName();
    boolean isAuthorized = authorizedUsers.isAuthorized(user);
    CheckAuthorizationResponse response = CheckAuthorizationResponse.newBuilder().setIsAuthorized(isAuthorized).build();
    responseStreamObserver.onNext(response);
    responseStreamObserver.onCompleted();
  }
}
