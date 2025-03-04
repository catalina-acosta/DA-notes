import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "da-notes-a503f", appId: "1:1060396128944:web:63b01b2289bcd8aa7b3975", storageBucket: "da-notes-a503f.firebasestorage.app", apiKey: "AIzaSyCkf8vEx8h9H97wbrmFyMhQ9q-sFHTZYC4", authDomain: "da-notes-a503f.firebaseapp.com", messagingSenderId: "1060396128944", measurementId: "G-0FHS1CYRNH" })), provideFirestore(() => getFirestore())]
};
