import { jest } from "@jest/globals";

const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockTokenService = {
  issueTokens: jest.fn(() => ({
    accessToken: "fake-access",
    refreshToken: "fake-refresh",
  })),
};

jest.unstable_mockModule("../../repositories/user.repository.js", () => ({
  UserRepository: mockUserRepository,
}));

jest.unstable_mockModule("../token.service.js", () => ({
  TokenService: mockTokenService,
}));

const {
  AuthService,
  EmailAlreadyRegisteredError,
  WeakPasswordError,
  ValidationError,
} = await import("../auth.service.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AuthService.register", () => {
    test("creates a user and issues tokens for valid input", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: "u1",
        email: "a@x.com",
      });
  
      const result = await AuthService.register({
        email: "a@x.com",
        displayName: "Alice",
        password: "correcthorse",
      });
  
      expect(result.user.id).toBe("u1");
      expect(result.accessToken).toBe("fake-access");
    });

    test("rejects an already-registered email", async () => {
        mockUserRepository.findByEmail.mockResolvedValue({
          id: "existing",
        });
    
        await expect(
          AuthService.register({
            email: "a@x.com",
            displayName: "Alice",
            password: "correcthorse",
          })
        ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
      });

      test("rejects a 7-character password", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
    
        await expect(
          AuthService.register({
            email: "a@x.com",
            displayName: "Alice",
            password: "1234567",
          })
        ).rejects.toBeInstanceOf(WeakPasswordError);
      });

      test("accepts an 8-character password", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue({ id: "u1" });
    
        await expect(
          AuthService.register({
            email: "a@x.com",
            displayName: "Alice",
            password: "12345678",
          })
        ).resolves.toBeDefined();
      });

      test("rejects a missing email", async () => {
        await expect(
          AuthService.register({
            email: "",
            displayName: "Alice",
            password: "correcthorse",
          })
        ).rejects.toBeInstanceOf(ValidationError);
      });

      test("converts a repository failure into EmailAlreadyRegisteredError", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockRejectedValue(
          new Error("unique constraint violated")
        );
    
        await expect(
          AuthService.register({
            email: "a@x.com",
            displayName: "Alice",
            password: "correcthorse",
          })
        ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
      });
  });