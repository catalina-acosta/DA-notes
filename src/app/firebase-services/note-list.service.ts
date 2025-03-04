import { Injectable } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';



@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  items$;
  items;
  
  unsubList;
  unsubSingle;

  firestore = inject(Firestore);
  
  constructor() { 
    this.unsubList = onSnapshot(this.getNotesRef(),  (list) => {
      list.forEach(element => {
        console.log(element);
        
      })
    });

    this.unsubSingle = onSnapshot(this.getSingleDoc("notes", "jahdisohf"),  (element) => {
      console.log(element);
      
    });

    this.unsubSingle(); // equivallent of unsubscribe
    this.unsubList(); 

    this.items$ = collectionData(this.getNotesRef());
    this.items = this.items$.subscribe((list) => {
      list.forEach(element => {
        console.log(element);
        
      })
    })
  }

  getTrashReft() {
    return collection(this.firestore, 'trash');
  }
  
  getNotesRef() {
    return collection(this.firestore, 'notes');
  }
  
  getSingleDoc(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
