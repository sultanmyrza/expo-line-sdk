import ExpoLineSDK from "../ExpoLineSdk";
import ExpoLineSdkModule from "../ExpoLineSdkModule";
import { AccessToken } from "../model";

jest.mock("../ExpoLineSdkModule", () => ({
  __esModule: true,
  default: {
    setup: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
    refreshToken: jest.fn(),
    verifyAccessToken: jest.fn(),
    getBotFriendshipStatus: jest.fn(),
    currentAccessToken: jest.fn(),
    logout: jest.fn(),
  },
}));

const dummyAccessToken = `
    {
      "access_token":"123",
      "refresh_token":"abc",
      "token_type":"Bearer",
      "scope":"profile abcd",
      "id_token": "id_token",
      "expires_in":2592000
    }
  `;

const dummyProfile = `
    {
      "userId":"abcd",
      "displayName":"Brown",
      "pictureUrl":"https://example.com/abc",
      "statusMessage":"Hello, LINE!"
    }
  `;

const dummyVerifyToken = `
    {
      "scope":"profile",
      "client_id":"1440057261",
      "expires_in":2591659
    }
  `;

const dummyGetBotFriendshipStatus = `
    {
      "friendFlag": true
    }
  `;

const native = ExpoLineSdkModule;

describe("Models", () => {
  test("access_token should be parsed correctly", () => {
    const token = new AccessToken(JSON.parse(dummyAccessToken));
    expect(token.value).toBe("123");
    expect(token.expiresIn).toBe(2592000);
    expect(token.tokenType).toBe("Bearer");
    expect(token.scopes).toEqual(["profile", "abcd"]);
  });
});

describe("ExpoLineSDK", () => {
  beforeEach(() => {
    native.setup.mockResolvedValue(undefined);
    native.login.mockResolvedValue(
      `{"accessToken": ${dummyAccessToken}, "userProfile": ${dummyProfile}}`,
    );
    native.getProfile.mockResolvedValue(dummyProfile);
    native.refreshToken.mockResolvedValue(dummyAccessToken);
    native.verifyAccessToken.mockResolvedValue(dummyVerifyToken);
    native.getBotFriendshipStatus.mockResolvedValue(
      dummyGetBotFriendshipStatus,
    );
    native.currentAccessToken.mockResolvedValue(null);
    native.logout.mockResolvedValue(undefined);
  });

  test("setup", async () => {
    await ExpoLineSDK.instance.setup({ channelId: "123" });
    expect(native.setup).toHaveBeenCalledWith({ channelId: "123" });
  });

  test("login", async () => {
    const v = await ExpoLineSDK.instance.login();
    expect(v.accessToken.value).toBe("123");

    expect(v.accessToken.scopes.length).toBe(2);
    expect(v.accessToken.scopes.includes("profile")).toBe(true);
    expect(v.accessToken.scopes.includes("abcd")).toBe(true);

    expect(v.userProfile?.userId).toBe("abcd");
  });

  test("user profile", async () => {
    const v = await ExpoLineSDK.instance.getProfile();
    expect(v.userId).toBe("abcd");
  });

  test("refresh token", async () => {
    const v = await ExpoLineSDK.instance.refreshToken();
    expect(v.value).toBe("123");
  });

  test("verify access token", async () => {
    const v = await ExpoLineSDK.instance.verifyAccessToken();
    expect(v.channelId).toBe("1440057261");
  });

  test("get LINE Official Account friendship status", async () => {
    const v = await ExpoLineSDK.instance.getBotFriendshipStatus();
    expect(v.isFriend).toBe(true);
  });
});
