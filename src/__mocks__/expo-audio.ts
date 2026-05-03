export const createAudioPlayer = jest.fn(() => ({
  play: jest.fn(),
  remove: jest.fn(),
}));

export const useAudioPlayer = jest.fn(() => ({
  play: jest.fn(),
  remove: jest.fn(),
}));
