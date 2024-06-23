import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc, limit, where, query  } from '@angular/fire/firestore';
import { Observable, elementAt } from 'rxjs';
import { Note } from './../interfaces/note.interface';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  firestore: Firestore = inject(Firestore);

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  markedNotes: Note[] = [];

  unsubRalList;
  unsubNotesList;
  unsubMarkedNotes;

  constructor() {
    this.unsubRalList = this.subTrashList();
    this.unsubNotesList = this.subNoteList();
    this.unsubMarkedNotes = this.subMarkedNoteList();
  }

  async deleteNote(colID: string, docID: string){
    console.log(colID, docID);
    await deleteDoc(this.getSingleDoc(colID, docID));
}

  async addNote(note: Note, colID: string){
    const notesRef = collection(this.firestore, colID);
    const docRef = await addDoc(notesRef, note);
    note.id = docRef.id;
    await updateDoc(docRef, { id: docRef.id });

  }

  async updateDoc(note: Note){
    if (note.id) {
      const cleanNote = this.getCleanJson(note);
      await updateDoc(this.getSingleDoc(note.type, note.id), cleanNote);
    }
  }

  getCleanJson(note:Note){
    return {
      id: note.id,
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }
  
  subTrashList(){
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setObject(element.data(), element.id));
      })
    });
  }
  
  getTrashRef(){
    return collection(this.firestore, 'trash');
  }

  subNoteList(){
    const ref = collection(this.firestore, 'notes/Nxo5ulH15EoY4UpnGmwj/spezialnotes/XCeheqZfkMaQcdSz8WH0')
    const notesRef = this.getNotesRef();
    const q = query(notesRef, limit(10));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setObject(element.data(), element.id));
      })
    });
  }

  subMarkedNoteList(){
    const notesRef = this.getNotesRef();
    const q = query(notesRef, where('marked', '==', true), limit(10));
    return onSnapshot(q, (list) => {
      this.markedNotes = [];
      list.forEach((element) => {
        this.markedNotes.push(this.setObject(element.data(), element.id));
      })
    });
  }

  getNotesRef(){
    return collection(this.firestore, 'notes');
  }

  setObject(obj: any, id: string): Note {
    return {
    id: id || "",
    type: obj.type || "note",
    title: obj.title || "",
    content: obj.content || "",
    marked: obj.marked || false,
  }}

  ngonDestroy(){
    this.unsubRalList();
    this.unsubNotesList();
    this.unsubMarkedNotes();
  }

  getSingleDoc(colID: string, docID: string){
    const docRef = doc(collection(this.firestore, this.getRightCollection(colID)), docID);
    return docRef;
  }

  getRightCollection(colID: string){
    if (colID == 'note') {
      return 'notes'
    } else{
      return 'trash'
    }
  }

}