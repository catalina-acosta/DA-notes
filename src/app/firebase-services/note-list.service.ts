import { Injectable } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { inject } from '@angular/core';
import { Firestore, collection, doc, collectionData } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  items$;
  firestore = inject(Firestore);
  
  getTrashReft() {
    return collection(this.firestore, 'trash');
  }
  
  getNotesReft() {
    return collection(this.firestore, 'notes');
  }
  
  getSingleDoc(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }
  constructor() { 
    items$ = collectionData(this.getNotesReft())
  }
}
