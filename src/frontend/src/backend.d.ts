import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Verse {
    text: string;
    testament: Testament;
    reference: string;
    image?: ExternalBlob;
}
export interface Story {
    title: string;
    summary: string;
    verses: Array<Verse>;
    image?: ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export enum Testament {
    new_ = "new",
    old = "old"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addStoryOrVerseImage(blob: ExternalBlob, isStory: boolean, index: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyVerse(): Promise<Verse>;
    getStories(): Promise<Array<Story>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVersesByTestament(testament: Testament): Promise<Array<Verse>>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
