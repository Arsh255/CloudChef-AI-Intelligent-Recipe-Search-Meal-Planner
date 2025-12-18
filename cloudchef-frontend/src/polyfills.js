// Fix "global is not defined"
window.global = window;

// Fix missing Buffer
import { Buffer } from "buffer";
window.Buffer = Buffer;

// Fix missing process
import process from "process";
window.process = process;
