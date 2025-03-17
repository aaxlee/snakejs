export const socket = io("http://10.32.45.162:3000");

export const c = document.getElementById("canvas");
export const ctx = c.getContext("2d");
export const grid_size = 50;

export const WIDTH = c.width;
export const HEIGHT = c.height;

export const TARGET_FPS = 30;
export const FRAME_TIME = 1000 / TARGET_FPS; // Time per frame in milliseconds
