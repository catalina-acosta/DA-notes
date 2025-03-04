import { Injectable } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';



@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash;
  unsubNotes;

  firestore = inject(Firestore);
  
  constructor() { 
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
  }

  async updateNote(colId: string, docId: string, item: {}) {
    await updateDoc(this.getSingleDoc(colId, docId), item).catch(
      (err) => { console.log(err);
      }
    ).then();
  }

  async addNote(item: Note) {
    await addDoc(this.getNotesRef(), item).catch(
      (error) => { console.error(error);
      }
    ).then(
      (docRef) => {console.log("Document written with ID:", docRef?.id);
      }
    )
  }
  
  ngonDestroy() {
    this.unsubTrash(); // equivallent of unsubscribe
    this.unsubNotes(); 

  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(),  (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(),  (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
        
      })
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id, 
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }
  
  getNotesRef() {
    return collection(this.firestore, 'notes');
  }
  
  getSingleDoc(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
