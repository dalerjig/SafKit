export const scrollbar = {
  "&::-webkit-scrollbar": {
    height: 10,
    width: 10,
    backgroundColor: "transparent"
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#d8d8d8",
    backgroundClip: "padding-box"
  },
  "&::-webkit-scrollbar-thumb:vertical": {
    borderLeft: "4px solid transparent"
  },
  "&::-webkit-scrollbar-thumb:horizontal": {
    borderTop: "4px solid transparent"
  },
  "&::-webkit-scrollbar-thumb:hover": {
    borderTop: 0,
    borderLeft: 0
  }
} as const;
