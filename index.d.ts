/// <reference types="node" />

export type Filepath = string | Buffer;

export type Format = "hex" | "binary";

export type Data = {
    width: number;
    height: number;
    data: Uint8Array | Uint8ClampedArray | number[];
};

export function hash(filepath: Filepath, bits?: number, format?: Format): Promise<string>;
export function hashRaw(data: Data, bits: number): string;
export function hexToBinary(s: string): string;
export function binaryToHex(s: string): string;