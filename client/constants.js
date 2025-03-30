export const socket = io();

export const join_button = document.getElementById("join-button");
export const title_screen = document.getElementById("title-screen");

export const c = document.getElementById("canvas");
export const canvas_container = document.getElementById("canvas-container");
export const ctx = c.getContext("2d");
export const grid_size = 50;

export const WIDTH = c.width;
export const HEIGHT = c.height;

export const TARGET_FPS = 30;
export const FRAME_TIME = 1000 / TARGET_FPS; // time per frame (milliseconds)
