import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Berikan path ke aplikasi Next.js kamu untuk memuat next.config.js dan file .env
  dir: "./",
});

// Tambahkan konfigurasi custom Jest di sini
const config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  // Jika kamu menggunakan path alias (seperti @/components)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  verbose: true,
};

export default createJestConfig(config);
