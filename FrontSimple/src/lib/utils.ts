import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CreateUserData } from "@/types/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate UUID v4
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Simple hash functions (simulated for demo)
export function generateHashes(password: string) {
  // In a real app, use proper crypto libraries
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  return {
    salt: "example_salt_" + Math.random().toString(36).substring(2),
    md5: "md5_" + btoa(password).substring(0, 32),
    sha1: "sha1_" + btoa(password).substring(0, 40), 
    sha256: "sha256_" + btoa(password).substring(0, 64)
  };
}

// Get user location and timezone
export async function getUserLocationData(): Promise<{
  latitude: string;
  longitude: string;
  timezoneOffset: string;
  timezoneDescription: string;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Fallback to default values
      const now = new Date();
      const timezoneOffset = now.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
      const offsetMinutes = Math.abs(timezoneOffset) % 60;
      const sign = timezoneOffset <= 0 ? "+" : "-";
      
      resolve({
        latitude: "0",
        longitude: "0", 
        timezoneOffset: `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`,
        timezoneDescription: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
        const offsetMinutes = Math.abs(timezoneOffset) % 60;
        const sign = timezoneOffset <= 0 ? "+" : "-";
        
        resolve({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          timezoneOffset: `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`,
          timezoneDescription: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      },
      () => {
        // Fallback on error
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
        const offsetMinutes = Math.abs(timezoneOffset) % 60;
        const sign = timezoneOffset <= 0 ? "+" : "-";
        
        resolve({
          latitude: "0",
          longitude: "0",
          timezoneOffset: `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`,
          timezoneDescription: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      }
    );
  });
}

// Calculate age from date
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Format full name
export function formatFullName(title: string, firstName: string, lastName: string): string {
  return `${title} ${firstName} ${lastName}`;
}

// Download file blob
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}