/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "ru.kreketjot.auth";

export interface CheckAuthorizationRequest {
  name: string;
}

export interface CheckAuthorizationResponse {
  isAuthorized: boolean;
}

function createBaseCheckAuthorizationRequest(): CheckAuthorizationRequest {
  return { name: "" };
}

export const CheckAuthorizationRequest = {
  encode(message: CheckAuthorizationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckAuthorizationRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckAuthorizationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckAuthorizationRequest {
    return { name: isSet(object.name) ? String(object.name) : "" };
  },

  toJSON(message: CheckAuthorizationRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckAuthorizationRequest>, I>>(base?: I): CheckAuthorizationRequest {
    return CheckAuthorizationRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CheckAuthorizationRequest>, I>>(object: I): CheckAuthorizationRequest {
    const message = createBaseCheckAuthorizationRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseCheckAuthorizationResponse(): CheckAuthorizationResponse {
  return { isAuthorized: false };
}

export const CheckAuthorizationResponse = {
  encode(message: CheckAuthorizationResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isAuthorized === true) {
      writer.uint32(8).bool(message.isAuthorized);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckAuthorizationResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckAuthorizationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.isAuthorized = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CheckAuthorizationResponse {
    return { isAuthorized: isSet(object.isAuthorized) ? Boolean(object.isAuthorized) : false };
  },

  toJSON(message: CheckAuthorizationResponse): unknown {
    const obj: any = {};
    message.isAuthorized !== undefined && (obj.isAuthorized = message.isAuthorized);
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckAuthorizationResponse>, I>>(base?: I): CheckAuthorizationResponse {
    return CheckAuthorizationResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CheckAuthorizationResponse>, I>>(object: I): CheckAuthorizationResponse {
    const message = createBaseCheckAuthorizationResponse();
    message.isAuthorized = object.isAuthorized ?? false;
    return message;
  },
};

export type AuthServiceService = typeof AuthServiceService;
export const AuthServiceService = {
  checkAuthorization: {
    path: "/ru.kreketjot.auth.AuthService/checkAuthorization",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CheckAuthorizationRequest) =>
      Buffer.from(CheckAuthorizationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CheckAuthorizationRequest.decode(value),
    responseSerialize: (value: CheckAuthorizationResponse) =>
      Buffer.from(CheckAuthorizationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CheckAuthorizationResponse.decode(value),
  },
} as const;

export interface AuthServiceServer extends UntypedServiceImplementation {
  checkAuthorization: handleUnaryCall<CheckAuthorizationRequest, CheckAuthorizationResponse>;
}

export interface AuthServiceClient extends Client {
  checkAuthorization(
    request: CheckAuthorizationRequest,
    callback: (error: ServiceError | null, response: CheckAuthorizationResponse) => void,
  ): ClientUnaryCall;
  checkAuthorization(
    request: CheckAuthorizationRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CheckAuthorizationResponse) => void,
  ): ClientUnaryCall;
  checkAuthorization(
    request: CheckAuthorizationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CheckAuthorizationResponse) => void,
  ): ClientUnaryCall;
}

export const AuthServiceClient = makeGenericClientConstructor(
  AuthServiceService,
  "ru.kreketjot.auth.AuthService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): AuthServiceClient;
  service: typeof AuthServiceService;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
