import type { StateStorage } from "zustand/middleware";

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function getStorage(): StateStorage {
  if (typeof window === "undefined") {
    return memoryStorage;
  }
  return window.localStorage;
}
