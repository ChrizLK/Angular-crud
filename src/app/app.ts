
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Book } from './models/book';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, NgForOf, NgFor, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

  http = inject(HttpClient);
  apiUrl = 'http://localhost:2300/api/Books';
  books: Book[] = [];
  form: Book = {  title: '', author: '',id:0 , publishedDate: new Date , isbn:'' };
  editingId: number | null = null;



  // READ
  load() {
    this.http.get<Book[]>(this.apiUrl)
      .subscribe(res => this.books = res);
  }

  // CREATE
  save() {
    if (this.editingId) {
      this.http.put(`${this.apiUrl}/${this.editingId}`, this.form)
        .subscribe(() => {
          this.load();
          this.reset();
        });
    } else {
      this.http.post(this.apiUrl, this.form)
        .subscribe(() => {
          this.load();
          this.reset();
        });
    }
  }

  // EDIT
  edit(book: Book) {
    this.editingId = book.id;
    this.form = { title: book.title, author: book.author , isbn:book.isbn , publishedDate:book.publishedDate ,id:book.id };
  }

  // DELETE
  remove(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe(() => this.load());
  }

  reset() {
    this.form = { title: '', author: '',id:0 , publishedDate: new Date , isbn:'' };
    this.editingId = null;
  }

  ngOnInit() {
    this.load();
  }


}
