import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"besimnotes","appId":"1:164808944785:web:7166053d8ab5baef4ae330","storageBucket":"besimnotes.appspot.com","apiKey":"AIzaSyBJiAOlF55dfdI6Rc2u3ExKaXM8Gn-9SQQ","authDomain":"besimnotes.firebaseapp.com","messagingSenderId":"164808944785"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
