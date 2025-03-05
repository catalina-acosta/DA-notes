import { Injectable } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';



@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;
  
  constructor(private firestore: Firestore) { 
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
  }

  async deleteNote(colId: "notes" | "trash", docId:string) {
      await deleteDoc(this.getSingleDoc(colId, docId)).catch(
        (err) => { console.log(err);
        }
      );
  }

  async updateNote(note: Note) {
    if(note.id) {
      let docRef = this.getSingleDoc(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err);
        }
      );
    }
  }

  getCleanJson(note:Note): {} {
    return {
      type: note.type || "note",
      title: note.title || "",
      content: note.content || "",
      marked: note.marked || false,
    }
  }

  getColIdFromNote(note:Note) {
    if(note.type == "note") {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, colId: "notes" | "trash") {
    await addDoc(this.getItemsRef(colId), item).catch(
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
    this.unsubMarkedNotes();

  }

  subTrashList() {
    return onSnapshot(this.getItemsRef("trash"),  (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNotenoteect(element.data(), element.id));
      })
    });
  }

  subNotesList() {
    const q = query(this.getItemsRef("notes"), orderBy('title'), limit(3)) // using query to filer results with orderedBy and a limit of 3
    return onSnapshot(q,  (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNotenoteect(element.data(), element.id));
      });
    });
  }

  subMarkedNotesList() {
    const q = query(this.getItemsRef("notes"), where("marked", "==", true)) // using query to filer results with orderedBy and a limit of 3
    return onSnapshot(q,  (list) => {
      this.normalMarkedNotes = [];
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNotenoteect(element.data(), element.id));
        
      })
    });
  }

  setNotenoteect(note: any, id: string): Note {
    return {
      id: id, 
      type: note.type || "note",
      title: note.title || "",
      content: note.content || "",
      marked: note.marked || false,
    }
  }

  getItemsRef(colId:string) {
    if(colId === "trash") {
      return collection(this.firestore, 'trash');
    } else {
      return collection(this.firestore, 'notes');
    }
  }
  
  getSingleDoc(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
